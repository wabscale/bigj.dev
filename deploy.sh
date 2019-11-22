#!/bin/bash

cd $(dirname $(realpath $0))

set -ex

load_env() {
    # Just make sure that .env gets loaded right
    if [ -f .env ]; then
        export $(cat .env | xargs)
    fi
}

check_acme() {
    # acme.json file must be a file with specific permissions to work.
    # create and set permissions if they are not already set
    ACME_PATH="${CONFIG_PATH}/acme.json"
    if [ ! -f ${ACME_PATH} ]; then
        mkdir -p $(echo ${ACME_PATH} | xargs dirname)
        touch ${ACME_PATH}
        chmod 600 ${ACME_PATH}
    fi
}

check_proxy() {
    # check to see if traefik-proxy network is created
    if ! docker network ls | awk '{print $2}' | grep 'traefik-proxy' &> /dev/null; then
        docker network create traefik-proxy;
    fi
}

check_env() {
    # Checks to make sure necessary env vars are set

    required_env_vars=(
        # acme email address
        ACME_EMAIL

        # domain to be deployed on and default webui password
        API_DOMAIN
        API_ROOT_PASSWORD

        # mysql root password
        MYSQL_ROOT_PASSWORD

        # upload directory and persistent config location
        UPLOAD_PATH
        CONFIG_PATH
    )

    for var_name in ${required_env_vars[@]}; do
        if env | grep "^${var_name}="; then
            # if var not defined
            >&2 echo "ERROR ${var_name} is not defined! This variable is required."
            exit 1
        fi
    done
}

check_override() {
    # remove debug files if present
    if [ -f ./docker-compose.override.yml ]; then
        # Remove debug compose
        rm ./docker-compose.override.yml
    fi
}

up_persistent_services() {
    # bring up persistent services if they are not up
    persistent_services=(
        traefik
        db
    )

    for service in ${persistent_services[@]}; do
        if ! docker ps | grep "${service}"; then
            docker-compose up -d --build --force-recreate --remove-orphans "${service}"
        fi
    done
}

up_main_services() {
    # bring up main services
    docker-compose up -d --force-recreate --remove-orphans api frontend
}


main() {
    # load env
    load_env

    # checks
    check_env
    check_acme
    check_proxy
    check_override

    # bring service up
    up_persistent_services
    up_main_services
}

main
