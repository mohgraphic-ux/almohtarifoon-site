#!/usr/bin/env bash
# Daily copy of the site database and uploaded images (kept 14 days). Restore by stopping the
# service and extracting the archive over /srv/almohtarifoon-site/.wrangler.
set -euo pipefail
APP_DIR=/srv/almohtarifoon-site DEST=/var/backups/almohtarifoon
mkdir -p "$DEST"
tar -czf "$DEST/site-$(date +%F).tar.gz" -C "$APP_DIR" .wrangler/state .wrangler/applied-migrations.txt
find "$DEST" -name 'site-*.tar.gz' -mtime +14 -delete
