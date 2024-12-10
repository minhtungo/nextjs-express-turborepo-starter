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
COPY . .
# Prune the workspace to only include api-specific dependencies
RUN turbo prune api --docker

# Stage 2: Installer
# Installs dependencies and builds the application
FROM base AS installer
# Enable pnpm
RUN corepack enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN mkdir -p /pnpm
# Install Alpine Linux dependencies
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy pruned package.json files and lockfile
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
RUN pnpm turbo build

# Stage 3: Runner
# Run the production build
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
USER expressjs

# Copy the built application
COPY --from=installer /app .

EXPOSE 3001

CMD node apps/api/dist/index.js