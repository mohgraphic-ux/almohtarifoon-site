#!/usr/bin/env bash
# Creates /etc/almohtarifoon/site.env with the admin email and password (asked here, stored only as a
# hash). Run as root:  sudo bash /srv/almohtarifoon-site/deploy/make-admin.sh spaprofacademy.com
set -euo pipefail
DOMAIN="${1:?usage: make-admin.sh <domain>}"
APP_USER=almohtarif APP_DIR=/srv/almohtarifoon-site ENV_FILE=/etc/almohtarifoon/site.env
export PATH="/opt/node22/bin:$PATH"
read -rp "إيميل مدير الموقع: " ADMIN_EMAIL
[[ "$ADMIN_EMAIL" == *@*.* ]] || { echo "إيميل غير صحيح"; exit 1; }
HASH="$(cd "$APP_DIR" && node scripts/hash-password.mjs)"
mkdir -p "$(dirname "$ENV_FILE")"
umask 027
cat > "$ENV_FILE" <<ENV
SELF_HOSTED=1
SITE_ORIGIN=https://$DOMAIN
ADMIN_EMAIL=$ADMIN_EMAIL
ADMIN_PASSWORD_HASH=$HASH
SESSION_SECRET=$(openssl rand -hex 32)
ENV
chown root:"$APP_USER" "$ENV_FILE"; chmod 640 "$ENV_FILE"
echo "تم حفظ حساب الإدارة. لتفعيله: sudo bash $APP_DIR/deploy/update.sh"
