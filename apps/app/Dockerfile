FROM node:22-alpine AS base

# Stage 1: Builder
# Sets up the build environment and prunes the monorepo
FROM base AS builder
# Enable pnpm
RUN corepack enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN mkdir -p /pnpm
# Install Alpine Linux dependencies
RUN apk update
RUN apk add --no-cache libc6-compat

WORKDIR /app
# Install Turborepo for monorepo management
RUN pnpm install -g turbo

# Copy the entire monorepo
COPY . .
# Prune the workspace to only include app-specific dependencies
RUN turbo prune app --docker

# Stage 2: Installer
# Installs dependencies and builds the application
FROM base AS installer
# Set up pnpm environment
RUN corepack enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN mkdir -p /pnpm
# Install system dependencies
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy pruned package.json files and lockfile
COPY --from=builder /app/out/json/ .
# COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
# Install dependencies based on the pruned workspace
RUN pnpm install 

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
RUN pnpm turbo build

# Stage 3: Runner
# Run the production build
FROM base AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copy necessary files from installer
COPY --from=installer --chown=nextjs:nodejs /app/apps/app/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/app/.next/static ./apps/app/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/app/public ./apps/app/public

EXPOSE 3000

CMD node apps/app/server.js