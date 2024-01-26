#!/bin/bash

if [[ $# -ne 3 ]]; then
    echo "Illegal number of parameters"
    exit 2
fi

START=$(date +%s)
echo $(date +%Y-%m-%d:%H:%M:%S)

db=$1
table=$2
file=$3

mysql -e "SET FOREIGN_KEY_CHECKS = 0; LOAD DATA LOCAL INFILE '$file' INTO TABLE $table; SET FOREIGN_KEY_CHECKS = 1;" --password=$MYSQL_ROOT_PASSWORD --default-character-set=utf8mb4 $db


STOP=$(date +%s)
DIFF=$(expr $STOP - $START)

echo $(date +%Y-%m-%d:%H:%M:%S)
echo $DIFF

