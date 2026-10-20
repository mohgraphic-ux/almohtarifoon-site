#!/usr/bin/env bash
# Load content exported from the dashboard ("تصدير المحتوى") into this server. Run as root:
#   sudo bash /srv/almohtarifoon-site/deploy/import-content.sh /path/to/export.json
# Replaces the site content (pages, news, team, texts…). Requests and uploaded images are not included.
set -euo pipefail
FILE="${1:?usage: import-content.sh <export.json>}"
APP_USER=almohtarif APP_DIR=/srv/almohtarifoon-site
cd "$APP_DIR"
SQL="$(mktemp --suffix=.sql)"; trap 'rm -f "$SQL"' EXIT
node -e '
const fs=require("fs");const d=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));
const data=d.data&&d.data.settings?d.data:d;
if(!data.settings||!data.home||!Array.isArray(data.pages))throw new Error("Not a site export");
const q=s=>"\x27"+s.replace(/\x27/g,"\x27\x27")+"\x27";
fs.writeFileSync(process.argv[2],"INSERT INTO content (id,data,version,updated_at) VALUES (\x27site\x27,"+q(JSON.stringify(data))+",1,"+q(new Date().toISOString())+") ON CONFLICT(id) DO UPDATE SET data=excluded.data,version=content.version+1,updated_at=excluded.updated_at;\n");
' "$FILE" "$SQL"
chown "$APP_USER" "$SQL"
systemctl stop almohtarifoon
sudo -u "$APP_USER" -H node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file "$SQL"
systemctl start almohtarifoon
echo "Content imported."
