#!/bin/bash
cd ~/server
echo "Running certbot via docker run..."

# Ensure permissions
sudo chmod -R 777 nginx/certbot-var
sudo chmod -R 777 nginx/certs

docker run --rm \
  -v "$(pwd)/nginx/certbot-var:/var/www/certbot" \
  -v "$(pwd)/nginx/certs:/etc/letsencrypt" \
  certbot/certbot \
  certonly --webroot --webroot-path /var/www/certbot \
  -d api.hiki.io.vn -d admin.hiki.io.vn \
  --email nguyenvanninh2004pt@gmail.com --agree-tos --no-eff-email -v

if [ $? -eq 0 ]; then
  echo "Certbot succeeded."
  if [ -f nginx/conf.d/default.conf.bak ]; then
      echo "Restoring Nginx SSL config..."
      mv nginx/conf.d/default.conf.bak nginx/conf.d/default.conf
      docker compose restart nginx
      echo "Nginx restarted with SSL."
  else
      echo "Warning: default.conf.bak not found. Please restore SSL config manually."
  fi
else
  echo "Certbot failed."
  exit 1
fi
