#!/bin/sh

set -xe

load_env() {
    # Just make sure that .env gets loaded right
    if [ -f .env ]; then
        export $(cat .env | xargs)
    fi
}

setup_deps() {
    # sets up node_modules for a given set of directory
    # usage: setup_deps api frontend
    for d in $@; do
        cd "${d}"
        yarn
        cd ..
    done
}

drop_compose_override() {
    # Drops docker-compose override into home directory

    if [ ! -f ./docker-compose.override.yml ]; then
        COMPRESSED_OVERRIDE="H4sIAAAAAAAAA82QQWvDMAyF7/kVwhR6ahMKg2HoodDCDqMJo9tljGBmtYgmsrE9b2Hsvy+Jw7aedi06GN6T5O8povNkWMJ8Nc8yjy7SK3qZAShLwwPwbtyZ+FRrchJEbmzIlbVi9DR7Cc+3y7FeRgk5kjPcIoc0D7AAUZUPh/VNURTiV9uX21292z+tNUZsjB1Gkh1N89YmjKl3mQ88l5+PxuzzsbovN9u62hzuvmSuVVDJZgwD+p8twSk80nlhnfnosl4+9qABWacWatUJJbDRKFVjiXEKFFxnDfV5QHTKMfig3ER6Jcf5CXJJ8O8JvgFiDYJr/wEAAA=="
        echo -n "${COMPRESSED_OVERRIDE}" | base64 -d -w 0 | gzip -d - > ./docker-compose.override.yml
    fi
}

check_proxy() {
    if ! docker network ls | awk '{print $2}' | grep 'traefik-proxy' &> /dev/null; then
        docker network create traefik-proxy;
    fi
}


up_persistent_services() {
    persistent_services=(
        traefik
        db
    )

    for service in ${persistent_services[@]}; do
        if docker ps | grep "${service}"; then
            docker-compose up -d --build --force-recreate --remove-orphans "${service}"
        fi
    done
}

up_main_services() {
    docker-compose up -d --force-recreate --remove-orphans api frontend
}

check_env() {
    # Checks to make sure necessary env vars are set

    required_env_vars=(
        ACME_EMAIL            # email for lets encrypt cert
        API_DOMAIN            # domain app is hosted on
        UPLOAD_PATH           # location for hosted resources
        MYSQL_ROOT_PASSWORD   # mysql database password
    )

    for var_name in ${required_env_vars[@]}; do
        if ! env | grep "^${var_name}=" &> /dev/null; then
            # if var not defined
            >&2 echo "ERROR ${var_name} is not defined! This variable is required."
            exit 1
        fi
    done

    optional_env_vars=(
        API_ROOT_PASSWORD     # password to be set for root user of webui
    )

    for var_name in ${required_env_vars[@]}; do
        if ! env | grep "^${var_name}=" &> /dev/null; then
            # if var not defined
            >&2 echo "ERROR ${var_name} is not defined! This variable is optional."
        fi
    done
}

main() {
    # load env
    load_env

    # setup debug dependencies
    drop_compose_override
    setup_deps api frontend

    # checks
    check_env
    check_proxy

    # bring services up
    up_persistent_services
    up_main_services
}

main

set +x

echo
echo 'Make sure you uncomment /etc/hosts'
