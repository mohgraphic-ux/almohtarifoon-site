#!/usr/bin/env bash
# Pull the latest code, rebuild, apply new database migrations and restart. Run as root:
#   sudo bash /srv/almohtarifoon-site/deploy/update.sh
set -euo pipefail
APP_USER=almohtarif APP_DIR=/srv/almohtarifoon-site ENV_FILE=/etc/almohtarifoon/site.env
cd "$APP_DIR"
as_app(){ sudo -u "$APP_USER" -H env PATH="$PATH" "$@"; }

echo "==> Code"
as_app git pull --ff-only
echo "==> Dependencies and build"
as_app npm run install:ci
as_app npm run build
install -m 640 -o root -g "$APP_USER" "$ENV_FILE" dist/server/.dev.vars

echo "==> Database migrations"
systemctl stop almohtarifoon || true
as_app mkdir -p .wrangler
APPLIED=.wrangler/applied-migrations.txt; as_app touch "$APPLIED"
for f in drizzle/*.sql; do
  grep -qxF "$(basename "$f")" "$APPLIED" && continue
  echo "    applying $f"
  as_app node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file "$f"
  basename "$f" | as_app tee -a "$APPLIED" >/dev/null
done

echo "==> Restart"
systemctl start almohtarifoon
sleep 5; systemctl --no-pager --lines=5 status almohtarifoon || true
