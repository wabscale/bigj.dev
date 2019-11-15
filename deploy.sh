#!/bin/bash

cd `dirname $0`

set -e

export UPLOAD_PATH=/home/jc/uploads

# if [ ! -f /etc/traefik/acme/acme.json ]; then
#     sudo mkdir -p /etc/traefik/acme/
#     sudo touch /etc/traefik/acme/acme.json
#     sudo chmod 600 /etc/traefik/acme/acme.json
# fi

if ! docker network ls | grep "traefik-proxy"; then
  docker network create traefik-proxy
fi

docker-compose up -d --force-recreate --build api frontend redirect

# if ! docker ps | grep 'traefik' | grep 'Up'; then
#     docker-compose up -d --force-recreate traefik
# fi

# if ! docker ps | grep 'redirect' | grep 'Up'; then
#     docker-compose up -d --force-recreate redirect
# fi

# if ! docker ps | grep 'mariadb' | grep 'Up'; then
#     docker-compose up -d --force-recreate db
# fi
