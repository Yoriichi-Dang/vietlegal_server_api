# Frontend Authentication Implementation Example

This document provides a practical example of how to implement the authentication flow in your Next.js frontend with App Router, connecting to your NestJS backend.

## Setup Files

### 1. Environment Variables

Create `.env.local` file in your Next.js project:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
BACKEND_URL=http://localhost:4000
```

### 2. Types Setup

Create `types/next-auth.d.ts` to extend the NextAuth types:

```typescript
import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
    accessToken?: string;
    error?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    backendAccessToken?: string;
    backendRefreshToken?: string;
    backendUserId?: string;
    tokenExpires?: number;
    error?: string;
  }
}
```

## Implementation

### 1. Authentication Configuration

In your project root, create `auth.ts`:

```typescript
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { cookies } from 'next/headers';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/auth/login`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            },
          );

          const data = await response.json();
          if (response.ok && data.user) {
            return {
              id: data.user.id,
              email: data.user.email,
              name: data.user.userData?.name,
              backendAccessToken: data.accessToken,
              backendRefreshToken: data.refreshToken,
              tokenExpires: Date.now() + data.expiresIn * 1000,
            };
          }
        } catch (error) {
          console.error('Auth error:', error);
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (account && user) {
        if (account.provider === 'google' && profile) {
          try {
            // Send Google profile info to backend
            const response = await fetch(
              `${process.env.BACKEND_URL}/auth/callback/google`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  id: account.providerAccountId,
                  email: profile.email,
                  name: profile.name,
                  picture: profile.picture,
                  access_token: account.access_token,
                  refresh_token: account.refresh_token,
                  id_token: account.id_token,
                  expires_at: account.expires_at,
                }),
              },
            );

            const data = await response.json();
            if (response.ok) {
              cookies().set('backendAccessToken', data.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: data.expiresIn,
                path: '/',
              });

              cookies().set('backendRefreshToken', data.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: '/',
              });

              token.backendAccessToken = data.accessToken;
              token.backendRefreshToken = data.refreshToken;
              token.backendUserId = data.user.id;
              token.tokenExpires = Date.now() + data.expiresIn * 1000;
            }
          } catch (error) {
            console.error('Google auth callback error:', error);
          }
        } else if ('backendAccessToken' in user) {
          // Credentials login
          cookies().set(
            'backendAccessToken',
            user.backendAccessToken as string,
            {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              maxAge: 3600, // 1 hour
              path: '/',
            },
          );

          cookies().set(
            'backendRefreshToken',
            user.backendRefreshToken as string,
            {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              maxAge: 60 * 60 * 24 * 7, // 7 days
              path: '/',
            },
          );

          token.backendAccessToken = user.backendAccessToken;
          token.backendRefreshToken = user.backendRefreshToken;
          token.backendUserId = user.id;
          token.tokenExpires = user.tokenExpires as number;
        }
      } else if (token.tokenExpires && Date.now() > token.tokenExpires) {
        // Token has expired, refresh it
        try {
          const refreshResult = await refreshAccessToken(
            token.backendRefreshToken as string,
          );
          if (refreshResult) {
            token.backendAccessToken = refreshResult.accessToken;
            token.backendRefreshToken = refreshResult.refreshToken;
            token.tokenExpires = Date.now() + refreshResult.expiresIn * 1000;

            cookies().set('backendAccessToken', refreshResult.accessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              maxAge: refreshResult.expiresIn,
              path: '/',
            });

            cookies().set('backendRefreshToken', refreshResult.refreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              maxAge: 60 * 60 * 24 * 7, // 7 days
              path: '/',
            });
          } else {
            // If refresh token is invalid, force user to log in again
            return { ...token, error: 'RefreshTokenError' };
          }
        } catch (error) {
          console.error('Failed to refresh token:', error);
          // Force the user to log in again
          return { ...token, error: 'RefreshTokenError' };
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token.backendAccessToken) {
        session.accessToken = token.backendAccessToken as string;
      }
      if (token.backendUserId) {
        session.user.id = token.backendUserId as string;
      }
      if (token.error) {
        session.error = token.error as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login', // Custom sign-in page
  },
});

// Helper function to refresh the access token
async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}
```

### 2. Auth API Route

Create `app/api/auth/[...nextauth]/route.ts`:

```typescript
import { handlers } from '@/auth';
import { NextRequest } from 'next/server';

export const GET = (request: NextRequest) => {
  return handlers.GET(request);
};

export const POST = (request: NextRequest) => {
  return handlers.POST(request);
};
```

### 3. API Utility Function

Create `utils/api.ts` for authenticated API calls with auto-refresh support:

```typescript
import { auth } from '@/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const session = await auth();

  // Check for auth errors
  if (session?.error === 'RefreshTokenError') {
    redirect('/login?error=session-expired');
  }

  const accessToken = cookies().get('backendAccessToken')?.value;

  if (!accessToken) {
    throw new Error('Not authenticated');
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
    ...options.headers,
  } as HeadersInit;

  const response = await fetch(`${process.env.BACKEND_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Handle error
    const error = await response
      .json()
      .catch(() => ({ message: 'API request failed' }));
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}
```

### 4. Create a Middleware for Client Components

Since the cookies module is only available in server components, create a middleware to check token validity in client components:

Create `middleware.ts` in your project root:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Get token and check if it's expired
  const token = await getToken({ req: request });

  // Check if token is expired and the current path requires authentication
  const isTokenExpired = token?.tokenExpires && Date.now() > token.tokenExpires;
  const isAuthPath = ['/dashboard', '/profile', '/protected'].some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  // If token is expired and user is on an authenticated path, redirect to login
  if (isTokenExpired && isAuthPath) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'session-expired');
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### 5. Login Page with Error Handling

Update your login page to handle token errors:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { signIn, useSearchParams } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Check for error in URL params
  useEffect(() => {
    const errorType = searchParams.get('error');
    if (errorType === 'session-expired') {
      setError('Your session has expired. Please log in again.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      setError('An error occurred during login');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Log in to your account</h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded">{error}</div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Log in
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50"
            >
              <span className="sr-only">Sign in with Google</span>
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 6. Dashboard Page Example

Create `app/dashboard/page.tsx`:

```tsx
import { auth } from '@/auth';
import { apiCall } from '@/utils/api';
import { redirect } from 'next/navigation';

async function getUserData() {
  try {
    return await apiCall('/auth/session');
  } catch (error) {
    return null;
  }
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const userData = await getUserData();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
        {userData ? (
          <div>
            <p>
              <strong>Name:</strong>{' '}
              {userData.userData?.name || session.user?.name || 'Not provided'}
            </p>
            <p>
              <strong>Email:</strong>{' '}
              {userData.email || session.user?.email || 'Not provided'}
            </p>
            <p>
              <strong>User ID:</strong>{' '}
              {userData.id || session.user?.id || 'Not available'}
            </p>
          </div>
        ) : (
          <p>Failed to load user data from backend.</p>
        )}
      </div>
    </div>
  );
}
```

### 7. Logout Button Component

Create `components/LogoutButton.tsx`:

```tsx
'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
    >
      Log out
    </button>
  );
}
```

## Usage Notes

1. Make sure your backend is running and accessible at the URL specified in `BACKEND_URL`
2. The httpOnly cookie approach stores the tokens securely
3. Access tokens are short-lived (typically 1 hour) while refresh tokens are longer-lived (7 days)
4. Refresh happens automatically:
   - In server components through the JWT callback
   - In client components via the middleware
5. The system will automatically redirect to login when refresh fails
6. Server components can access tokens through `cookies()`, client components through NextAuth session
