#!/bin/sh
set -e

# ─────────────────────────────────────────────────────────────────────────────
# Startup: apply pending DB migrations, then hand off to the app (CMD).
#
# For multi-replica deployments, prefer running migrations as a separate
# init-container / Job instead (see docs/DEPLOY-SELFHOST.md) and set
# RUN_MIGRATIONS=false here to avoid several replicas migrating at once.
# ─────────────────────────────────────────────────────────────────────────────

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  echo "[entrypoint] applying database migrations (prisma migrate deploy)…"
  ./node_modules/.bin/prisma migrate deploy
  echo "[entrypoint] migrations up to date."
else
  echo "[entrypoint] RUN_MIGRATIONS=false — skipping migrations."
fi

echo "[entrypoint] starting: $*"
exec "$@"
