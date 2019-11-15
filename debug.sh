#!/bin/sh

set -xe

if [ ! -f ./acme.json ]; then
    sudo mkdir -p /etc/traefik/acme/
    sudo touch /etc/traefik/acme/acme.json
    sudo chmod 600 /etc/traefik/acme/acme.json
fi

export UPLOAD_PATH=${HOME}/downloads

if ! docker network ls | awk '{print $2}' | grep 'traefik-proxy' &> /dev/null; then
    docker network create traefik-proxy;
fi

persistent_services=(
    redirect
    traefik
    db
)

for service in ${persistent_services[@]}; do
    if docker-compose ps | grep "${service}" | awk '{exit($3 == "Up")}'; then
        docker-compose up -d --build --force-recreate --remove-orphans "${service}"
    fi
done

docker-compose up -d --force-recreate --remove-orphans api frontend

set +x

echo
echo 'Make sure you uncomment /etc/hosts'
