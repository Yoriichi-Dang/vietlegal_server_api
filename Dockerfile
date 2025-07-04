# Multi-stage build
FROM node:18-alpine AS builder

# Tạo thư mục làm việc
WORKDIR /usr/src/app

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài đặt tất cả dependencies
RUN npm ci

# Copy source code
COPY . .

# Build ứng dụng
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Cài đặt dumb-init
RUN apk add --no-cache dumb-init

# Tạo thư mục làm việc
WORKDIR /usr/src/app

# Copy package.json
COPY package*.json ./

# Cài đặt chỉ production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application từ builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy other necessary files
COPY --from=builder /usr/src/app/tsconfig.json ./
COPY --from=builder /usr/src/app/nest-cli.json ./

# Expose port
EXPOSE 2410

# Tạo user non-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Chuyển ownership
RUN chown -R nestjs:nodejs /usr/src/app

USER nestjs

# Set NODE_ENV to development và chạy production build
ENV NODE_ENV=development

# Chạy ứng dụng production (không có watch)
CMD ["dumb-init", "node", "dist/src/main.js"]