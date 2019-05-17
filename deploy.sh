#!/bin/bash

set -e

if ! which mysqladmin; then
  sudo apt update && sudo apt install -y mysql-client
fi

if ! which node; then
  sudo apt update && sudo apt install -y nodejs npm
fi

if ! which sequelize; then
  npm install -g sequelize sequelize-cli mysql2
fi



if ! docker network ls | grep "traefik-proxy"; then
  docker network create traefik-proxy
fi

docker-compose build --no-cache
docker-compose kill
docker-compose rm -f
docker-compose up -d --force-recreate db api static traefik

echo "waiting for db to start..."
while ! mysqladmin ping -h "127.0.0.1" -P 3306 --silent; do
  sleep 1;
done
sleep 3
echo "db started"

cd db

sequelize db:migrate
