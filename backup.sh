#!/bin/sh

# Backs up mysql database
# depends on MYSQL_ROOT_PASSWORD being set correctly
# Usage:
#   ./backup.sh
#
# This script will create a file that looks like dump-1574324013.sql.gz

# Crontab
# @weekly /home/jc/projects/dev/backup.sh /home/jc/backups/dev


docker-compose exec db mysqldump -u root --password=${MYSQL_ROOT_PASSWORD} dev # | gzip - > dump-`date +%s`.sql.gz
