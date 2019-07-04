#!/bin/sh


# Crontab
# @weekly /home/jc/projects/dev/backup.sh /home/jc/backups/dev

if [ $# -ne 1 ]; then
    echo 'output dir needed'
    exit 1
fi

mkdir -p $1

mysqldump -h 127.0.0.1 -u root --password=password dev > ${1}/dump-`date +%s`.sql
