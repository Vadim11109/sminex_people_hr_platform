# syntax=docker/dockerfile:1

# ─────────────────────────────────────────────────────────────────────────────
# Sminex People — production image for self-hosting (corporate perimeter).
# Multi-stage: deps → builder → runner. Final image runs `prisma migrate deploy`
# on start, then launches the Next.js standalone server.
# Debian-slim base (not Alpine) — Prisma engines/OpenSSL work reliably on glibc.
# ─────────────────────────────────────────────────────────────────────────────

FROM node:22-slim AS base
# OpenSSL is required by Prisma's schema/migration engine.
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# ── deps: install all deps (incl. dev) for the build ──
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# ── builder: generate Prisma client + build Next in standalone mode ──
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# `build` script runs `prisma generate && next build`.
# DATABASE_URL is not needed for the build itself (only at runtime), but the
# Prisma driver adapter reads it lazily — a dummy value keeps generate happy.
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"
RUN npm run build

# ── runner: minimal runtime image ──
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Non-root user
RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

# Next.js standalone output (minimal server + traced node_modules)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Prisma bits needed to run migrations at startup:
#   - schema + migration SQL + prisma.config.ts
#   - the prisma CLI and generated client from the builder (avoids a network
#     install at runtime — important in an air-gapped corporate network)
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/dotenv ./node_modules/dotenv
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.bin/prisma ./node_modules/.bin/prisma

COPY --chown=nextjs:nodejs docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

USER nextjs
EXPOSE 3000

# Container-level healthcheck (orchestrators can also probe /api/health)
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
