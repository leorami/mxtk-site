# syntax=docker/dockerfile:1.6

# -------- base layer --------
FROM node:20-bookworm-slim AS base
ENV NODE_ENV=production
WORKDIR /app

# Install libc dependencies commonly required by Next.js sharp/og, etc.
RUN apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates git curl openssl libc6-dev \
  && rm -rf /var/lib/apt/lists/*

# Ensure both corepack pnpm and a global pnpm binary are available
RUN corepack enable || true \
  && corepack prepare pnpm@10.15.1 --activate || true \
  && npm i -g pnpm@10.15.1 || true

# -------- deps layer (with npm ci) --------
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

# -------- dev layer --------
FROM base AS dev
ENV NODE_ENV=development
WORKDIR /app
COPY . .

# Ensure devDependencies are present for Next.js dev (TypeScript types, tooling)
RUN npm ci --no-audit --no-fund

# Expose Next dev server
EXPOSE 2000

# Use HOST 0.0.0.0 for container access
ENV HOST=0.0.0.0
# Ensure deps are installed into the runtime volume before starting dev server
CMD ["sh","-lc","npm ci --no-audit --no-fund || npm install; npm run dev -- -p 2000 -H 0.0.0.0"]

# -------- build layer --------
FROM base AS build
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Next standalone output is enabled in next.config.mjs (output: 'standalone')
RUN npm run build

# -------- production runner (standalone) --------
FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=2000

# Create non-root user
RUN groupadd -r nextjs && useradd -r -g nextjs nextjs

# Copy standalone output and public assets
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

USER nextjs
EXPOSE 2000
CMD ["node","server.js"]
