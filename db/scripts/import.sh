#!/bin/bash

if [[ $# -eq 0 ]]; then
    echo "Illegal number of parameters"
    exit 2
fi

if [ ! -d "/dump/$1" ]; then
  echo "Directory not found /dump/$1"
  exit 2
fi

if [ ! -f "/dump/$1-struct.sql" ]; then
  echo "Directory not found /dump/$1-struct.sql"
  exit 2
fi

if [ ! -f "/dump/$1-trigger.sql" ]; then
  echo "File not found /dump/$1-trigger.sql"
  exit 2
fi

START=$(date +%s)
echo $(date +%Y-%m-%d:%H:%M:%S)

chmod 755 /dump/$1
chmod 644 /dump/$1/*

echo dump/$1-struct.sql
mysql --password=$MYSQL_ROOT_PASSWORD --default-character-set=utf8mb4 -e "DROP DATABASE $1;"
mysql --password=$MYSQL_ROOT_PASSWORD --default-character-set=utf8mb4 < /dump/$1-struct.sql

for file in /dump/$1/*.txt.gz
do
  if [[ -f $file ]]; then
    filename=$(basename -- "$file")
    name="${filename%.*}"
    echo "decompress ${name}"
    gunzip $file
  fi
done

for file in /dump/$1/*.txt
do
  if [[ -f $file ]]; then
    filename=$(basename -- "$file")
    name="${filename%.*}"
    echo "import ${name}"
    mysql -e "SET FOREIGN_KEY_CHECKS = 0; LOAD DATA LOCAL INFILE '$file' INTO TABLE $name; SET FOREIGN_KEY_CHECKS = 1;" --password=$MYSQL_ROOT_PASSWORD --default-character-set=utf8mb4 $1
  fi
done

echo /dump/$1-trigger.sql
mysql --password=$MYSQL_ROOT_PASSWORD --default-character-set=utf8mb4 < /dump/$1-trigger.sql

STOP=$(date +%s)
DIFF=$(expr $STOP - $START)

echo $(date +%Y-%m-%d:%H:%M:%S)
echo $DIFF

