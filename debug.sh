#!/bin/sh

set -xe

if [ ! -d ./.data/files ]; then
    mkdir -p ./.data/files;
fi

if ! docker network ls | awk '{print $2}' | grep 'traefik-proxy' &> /dev/null; then
    docker network create traefik-proxy;
fi

docker-compose up \
               -d \
               --build \
               --force-recreate \
               --remove-orphans \
               traefik \
               db

set +x

echo 'Make sure you uncomment /etc/hosts'
echo 'Ready to start api and frontend'
