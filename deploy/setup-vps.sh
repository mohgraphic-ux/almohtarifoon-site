#!/usr/bin/env bash
# One-time setup of the site on an Ubuntu 22.04/24.04 VPS (e.g. Hostinger KVM). Safe on servers that
# already host other sites: it adds its own Nginx site and service, installs Node 22 privately in
# /opt/node22 (the system Node is left alone) and does not change the firewall. Run as root:
#   curl -fsSL https://raw.githubusercontent.com/mohgraphic-ux/almohtarifoon-site/main/deploy/setup-vps.sh -o setup-vps.sh
#   sudo bash setup-vps.sh spaprofacademy.com you@example.com
set -euo pipefail
DOMAIN="${1:?usage: setup-vps.sh <domain> <certbot-email>}"
CERT_EMAIL="${2:?usage: setup-vps.sh <domain> <certbot-email>}"
REPO="${REPO:-https://github.com/mohgraphic-ux/almohtarifoon-site.git}"
APP_USER=almohtarif APP_DIR=/srv/almohtarifoon-site PORT="${PORT:-8787}"
[ "$(id -u)" = 0 ] || { echo "Run as root (sudo)."; exit 1; }
export DEBIAN_FRONTEND=noninteractive
HERE="$(cd "$(dirname "$0")" && pwd)"

echo "==> Packages"
apt-get update -y
apt-get install -y ca-certificates curl git nginx certbot python3-certbot-nginx openssl xz-utils
bash "$HERE/install-node.sh"

echo "==> Swap (the build needs ~2 GB of memory)"
if [ "$(awk '/MemTotal/{print int($2/1024)}' /proc/meminfo)" -lt 3000 ] && ! swapon --show | grep -q /swapfile; then
  fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
  grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

echo "==> App user and code"
id "$APP_USER" >/dev/null 2>&1 || useradd --system --create-home --home-dir /home/$APP_USER --shell /usr/sbin/nologin "$APP_USER"
[ -d "$APP_DIR/.git" ] || git clone "$REPO" "$APP_DIR"
chown -R "$APP_USER:$APP_USER" "$APP_DIR"

echo "==> Admin account"
[ -f /etc/almohtarifoon/site.env ] || bash "$APP_DIR/deploy/make-admin.sh" "$DOMAIN"

echo "==> Service"
sed -e "s#__APP_DIR__#$APP_DIR#g" -e "s#__USER__#$APP_USER#g" -e "s#__PORT__#$PORT#g" "$APP_DIR/deploy/almohtarifoon.service" > /etc/systemd/system/almohtarifoon.service
systemctl daemon-reload
systemctl enable almohtarifoon
bash "$APP_DIR/deploy/update.sh"

echo "==> Nginx site for $DOMAIN"
sed -e "s#__DOMAIN__#$DOMAIN#g" -e "s#__PORT__#$PORT#g" "$APP_DIR/deploy/nginx.conf" > "/etc/nginx/sites-available/$DOMAIN"
ln -sf "/etc/nginx/sites-available/$DOMAIN" "/etc/nginx/sites-enabled/$DOMAIN"
nginx -t && systemctl reload nginx

echo "==> Daily backup"
echo "30 3 * * * root bash $APP_DIR/deploy/backup.sh" > /etc/cron.d/almohtarifoon-backup

echo "==> HTTPS"
IP="$(curl -fsS -4 https://api.ipify.org || true)"
if [ -n "$IP" ] && [ "$(getent ahostsv4 "$DOMAIN" | awk 'NR==1{print $1}')" = "$IP" ]; then
  certbot --nginx --non-interactive --agree-tos -m "$CERT_EMAIL" -d "$DOMAIN" -d "www.$DOMAIN" --redirect
  echo "Done: https://$DOMAIN  (admin: https://$DOMAIN/admin)"
else
  echo "DNS for $DOMAIN does not point to this server ($IP) yet. After it does, run:"
  echo "  certbot --nginx --agree-tos -m $CERT_EMAIL -d $DOMAIN -d www.$DOMAIN --redirect"
fi
