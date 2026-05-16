# Dockerfile para documentação Archbase React
# Stage 1: Build
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY docs-site/ ./docs-site/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build all packages first
RUN pnpm -r --filter "./packages/*" build

# Build docs-site with static export
WORKDIR /app/docs-site
RUN pnpm build

# Stage 2: Production
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Labels
LABEL description="Archbase React Documentation"

# Copy nginx config
COPY deployment/docs/nginx.conf /etc/nginx/conf.d/

# Copy built static files from builder
COPY --from=builder /app/docs-site/out /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
