#!/bin/sh

echo "waiting for db to start..."
while ! mysqladmin ping -h "db" -P 3306 --silent; do
    sleep 1;
done
sleep 3
echo "db started"

cd src/db
npx sequelize db:migrate
cd ../../

yarn migrate
yarn debug
