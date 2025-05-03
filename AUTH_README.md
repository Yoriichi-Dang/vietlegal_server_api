# Authentication API Documentation

This document provides information on how to interact with the authentication API for the VietLegal system that supports both email/password authentication and Google OAuth.

## API Endpoints

### 1. Register a new user

**Endpoint**: `POST /auth/register`

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "Password123@",
  "username": "username123"
}
```

**Response**:

```json
{
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "emailVerified": false,
    "userData": {
      "id": "uuid-string",
      "name": "username123"
    }
  },
  "accessToken": "jwt-access-token-string",
  "refreshToken": "jwt-refresh-token-string",
  "expiresIn": 3600
}
```

### 2. Login with email/password

**Endpoint**: `POST /auth/login`

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "Password123@"
}
```

**Response**:

```json
{
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "emailVerified": false,
    "userData": {
      "id": "uuid-string",
      "name": "username123"
    }
  },
  "accessToken": "jwt-access-token-string",
  "refreshToken": "jwt-refresh-token-string",
  "expiresIn": 3600
}
```

### 3. Google OAuth Callback

**Endpoint**: `POST /auth/callback/google`

This endpoint is meant to be called from your frontend after NextAuth has processed the Google OAuth login.

**Request Body**:

```json
{
  "id": "google-account-id",
  "email": "user@gmail.com",
  "name": "User Name",
  "picture": "https://profile-picture-url.jpg",
  "access_token": "google-access-token",
  "refresh_token": "google-refresh-token",
  "id_token": "google-id-token",
  "expires_at": 1718724012000
}
```

**Response**:

```json
{
  "user": {
    "id": "uuid-string",
    "email": "user@gmail.com",
    "emailVerified": true,
    "provider": "google",
    "providerAccountId": "google-account-id",
    "userData": {
      "id": "uuid-string",
      "name": "User Name",
      "avatarUrl": "https://profile-picture-url.jpg"
    }
  },
  "accessToken": "jwt-access-token-string",
  "refreshToken": "jwt-refresh-token-string",
  "expiresIn": 3600
}
```

### 4. Refresh Access Token

**Endpoint**: `POST /auth/refresh`

Use this endpoint when the access token expires to get a new one without requiring the user to log in again.

**Request Body**:

```json
{
  "refreshToken": "jwt-refresh-token-string"
}
```

**Response**:

```json
{
  "accessToken": "new-jwt-access-token-string",
  "refreshToken": "new-jwt-refresh-token-string",
  "expiresIn": 3600
}
```

### 5. Get User Session

**Endpoint**: `GET /auth/session`

**Headers**:

```
Authorization: Bearer jwt-access-token-string
```

**Response**:

```json
{
  "id": "uuid-string",
  "email": "user@example.com",
  "emailVerified": true,
  "userData": {
    "id": "uuid-string",
    "name": "username123"
  }
}
```

## NextAuth Integration (App Router)

For your NextAuth.js configuration using the new App Router in your frontend, you should:

1. Use the OAuth callback to send the profile data to the backend
2. Store the returned JWT token for use with API calls

### Example NextAuth Configuration (App Router)

Create the following files:

#### 1. `auth.ts` or `auth.js` in your app root:

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

#### 2. Auth API Route

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

#### 3. API Utility Function

Create `utils/api.ts` for authenticated API calls:

```typescript
import { auth } from '@/auth';
import { cookies } from 'next/headers';

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const session = await auth();
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

## Security Considerations

1. The API uses JWT tokens for authentication with both access and refresh tokens
2. Access tokens are short-lived (default 1 hour) while refresh tokens have a longer lifespan (default 7 days)
3. Passwords are hashed using bcrypt
4. All API endpoints that require authentication should include the JWT token in the Authorization header
5. OAuth tokens are stored securely in the database
6. The authentication system automatically refreshes expired tokens
