# syntax=docker/dockerfile:1

# Base image
FROM node:20-alpine AS base
WORKDIR /app
# Do not set NODE_ENV here to allow installing devDependencies during build

# Install dependencies (including dev deps for build)
FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
# Install all deps (dev + prod) to build
RUN npm ci

# Build the application
FROM deps AS builder
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Ensure devDependencies available during build
RUN npm run build

# Prune devDependencies for production runtime
RUN npm prune --omit=dev

# Production image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Add a non-root user
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
RUN apk add --no-cache libc6-compat

# Copy necessary files from builder (standalone output)
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Also copy pruned node_modules for any runtime deps not bundled in standalone
COPY --from=builder /app/node_modules ./node_modules

# Set runtime env
ENV PORT=3000
EXPOSE 3000

USER nextjs

# Start the server
CMD ["node", "server.js"]