#!/usr/bin/env bash
# One-time setup of the site on an Ubuntu 22.04/24.04 VPS (e.g. Hostinger KVM). Run as root:
#   curl -fsSL https://raw.githubusercontent.com/mohgraphic-ux/almohtarifoon-site/main/deploy/setup-vps.sh -o setup-vps.sh
#   sudo bash setup-vps.sh spaprofacademy.com you@example.com
set -euo pipefail
DOMAIN="${1:?usage: setup-vps.sh <domain> <certbot-email>}"
CERT_EMAIL="${2:?usage: setup-vps.sh <domain> <certbot-email>}"
REPO="${REPO:-https://github.com/mohgraphic-ux/almohtarifoon-site.git}"
APP_USER=almohtarif APP_DIR=/srv/almohtarifoon-site ENV_DIR=/etc/almohtarifoon PORT=8787

[ "$(id -u)" = 0 ] || { echo "Run as root (sudo)."; exit 1; }
export DEBIAN_FRONTEND=noninteractive

echo "==> Swap (the build needs ~2 GB of memory)"
if [ "$(awk '/MemTotal/{print int($2/1024)}' /proc/meminfo)" -lt 3000 ] && ! swapon --show | grep -q /swapfile; then
  fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
  grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

echo "==> System packages"
apt-get update -y
apt-get install -y ca-certificates curl git nginx certbot python3-certbot-nginx ufw openssl
if ! command -v node >/dev/null || [ "$(node -p 'process.versions.node.split(".")[0]')" -lt 22 ]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi

echo "==> App user and code"
id "$APP_USER" >/dev/null 2>&1 || useradd --system --create-home --home-dir /home/$APP_USER --shell /usr/sbin/nologin "$APP_USER"
if [ ! -d "$APP_DIR/.git" ]; then git clone "$REPO" "$APP_DIR"; fi
chown -R "$APP_USER:$APP_USER" "$APP_DIR"

echo "==> Admin account"
mkdir -p "$ENV_DIR"
if [ ! -f "$ENV_DIR/site.env" ]; then
  read -rp "Admin email: " ADMIN_EMAIL
  HASH="$(cd "$APP_DIR" && node scripts/hash-password.mjs)"
  cat > "$ENV_DIR/site.env" <<ENV
SELF_HOSTED=1
SITE_ORIGIN=https://$DOMAIN
ADMIN_EMAIL=$ADMIN_EMAIL
ADMIN_PASSWORD_HASH=$HASH
SESSION_SECRET=$(openssl rand -hex 32)
ENV
fi
chown root:"$APP_USER" "$ENV_DIR/site.env"; chmod 640 "$ENV_DIR/site.env"

echo "==> Service"
sed -e "s#__APP_DIR__#$APP_DIR#g" -e "s#__USER__#$APP_USER#g" -e "s#__PORT__#$PORT#g" "$APP_DIR/deploy/almohtarifoon.service" > /etc/systemd/system/almohtarifoon.service
systemctl daemon-reload
systemctl enable almohtarifoon
bash "$APP_DIR/deploy/update.sh"

echo "==> Nginx and HTTPS"
sed -e "s#__DOMAIN__#$DOMAIN#g" -e "s#__PORT__#$PORT#g" "$APP_DIR/deploy/nginx.conf" > /etc/nginx/sites-available/almohtarifoon
ln -sf /etc/nginx/sites-available/almohtarifoon /etc/nginx/sites-enabled/almohtarifoon
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
ufw allow OpenSSH >/dev/null; ufw allow 'Nginx Full' >/dev/null; ufw --force enable >/dev/null
certbot --nginx --non-interactive --agree-tos -m "$CERT_EMAIL" -d "$DOMAIN" -d "www.$DOMAIN" --redirect

echo "==> Daily backup"
cat > /etc/cron.d/almohtarifoon-backup <<CRON
30 3 * * * root bash $APP_DIR/deploy/backup.sh
CRON

echo "Done: https://$DOMAIN  (admin: https://$DOMAIN/admin)"
