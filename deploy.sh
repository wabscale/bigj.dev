#!/bin/bash

cd `dirname $0`

set -e

export UPLOAD_PATH=/home/jc/uploads

if [ ! -f /etc/traefik/acme/acme.json ]; then
    sudo mkdir -p /etc/traefik/acme/
    sudo touch /etc/traefik/acme/acme.json
    sudo chmod 600 /etc/traefik/acme/acme.json
fi

if ! docker network ls | grep "traefik-proxy"; then
  docker network create traefik-proxy
fi

docker-compose build # --no-cache
docker-compose kill
docker-compose rm -f
docker-compose up -d --force-recreate db api frontend traefik
