#!/bin/bash

set -e

if [[ ! which mysqladmin ]]; then
  sudo apt update && sudo apt install -y mysql-client
fi

if [[ ! which sequelize ]]; then
  npm install -g sequelize mysql2
fi

if [[ ! docker network ls | grep "traefik-proxy" ]]; then
  docker network create traefik-proxy
fi

docker-compose build --no-cache
docker-compose kill
docker-compose rm -f
docker-compose up -d --force-recreate db api static

echo "waiting for db to start"
while ! mysqladmin ping -h "127.0.0.1" -P 3306 --silent; do
  sleep 1;
done

cd db

sequelize db:migrate --env "production"