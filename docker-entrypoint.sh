#!/bin/bash

CERT_PATH="/app/certs"
CERT_PFX_PATH="/app/certs/https-cert.pfx"
CERT_PASSWORD="yourpassword"
CERTBOT_LIVE_PATH="/etc/letsencrypt/live/www.miosito.net"

# Crea la directory per i certificati PFX
mkdir -p $CERT_PATH

# Ottieni un certificato SSL se non esiste già
if [ ! -f "$CERTBOT_LIVE_PATH/fullchain.pem" ]; then
    echo "Generazione del certificato SSL con Certbot..."
    certbot certonly --standalone --non-interactive --agree-tos \
        --email tuo@email.com \
        -d www.miosito.net -d miosito.net
fi

# Converte il certificato in formato PFX
if [ ! -f "$CERT_PFX_PATH" ]; then
    echo "Conversione del certificato in formato PFX..."
    openssl pkcs12 -export -out "$CERT_PFX_PATH" \
        -inkey "$CERTBOT_LIVE_PATH/privkey.pem" \
        -in "$CERTBOT_LIVE_PATH/cert.pem" \
        -certfile "$CERTBOT_LIVE_PATH/fullchain.pem" \
        -password pass:$CERT_PASSWORD
fi

# Configura il rinnovo automatico
echo "0 0 * * * certbot renew --quiet --deploy-hook 'openssl pkcs12 -export -out $CERT_PFX_PATH -inkey $CERTBOT_LIVE_PATH/privkey.pem -in $CERTBOT_LIVE_PATH/cert.pem -certfile $CERTBOT_LIVE_PATH/fullchain.pem -password pass:$CERT_PASSWORD'" > /etc/cron.d/certbot-renew
chmod 0644 /etc/cron.d/certbot-renew
crontab /etc/cron.d/certbot-renew

# Avvia cron in background
cron

# Avvia l'applicazione .NET
exec dotnet POC-InserimentoDati.dll \
    --Kestrel:Certificates:Default:Path=$CERT_PFX_PATH \
    --Kestrel:Certificates:Default:Password=$CERT_PASSWORD
