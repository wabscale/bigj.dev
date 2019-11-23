#!/bin/sh


wait_for_db() {
    # ping db until we get a response

    echo "waiting for db to start..."
    until mysqladmin ping -h "db" -P 3306 --silent; do
        sleep 1;
    done
    sleep 3 # give it another hot second...
    echo "db started"
}


initialize_db() {
    # This function will run migrations and seeds on database.
    # It is possible that seeds will fail. This may happen
    # with the config seeder. If the config entries are defined
    # then the unique contraint will cause an error. We can ignore
    # this error as our config entires are properly defined

    cd src/db
    npx sequelize db:migrate
    npx sequelize db:seed:all 2> /dev/null
    cd ../../
}

start_api() {
    # start api in either prod or debug mode

    if [ "${NODE_ENV}" = "development" ]; then
        >&2 echo "WARNING starting api in debug mode"
        exec yarn run debug
    fi

    exec yarn start
}

main() {
    wait_for_db
    initialize_db
    start_api
}

main
