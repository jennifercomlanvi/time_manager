#!/bin/bash

# Attention a la variable sql secure_file_priv

if [[ $# -eq 0 ]]; then
    echo "Illegal number of parameters"
    exit 2
fi

rm -rf /tmp/$1
mkdir /tmp/$1
chmod 777 /tmp/$1

if [[ $2 != "silent" ]]; then  
  echo $1
fi

mysqldump --password=$MYSQL_ROOT_PASSWORD --default-character-set=utf8mb4 --databases $1 --no-data --skip-triggers --quick --single-transaction > /dump/$1-struct.sql
#sed -i.bak 's/utf8/utf8mb4/g' dump/$1-struct.sql
mysqldump --password=$MYSQL_ROOT_PASSWORD --default-character-set=utf8mb4 --databases $1 --routines --no-create-info --no-data --no-create-db --skip-opt > /dump/$1-trigger.sql
#sed -i.bak 's/utf8/utf8mb4/g' dump/$1-trigger.sql
mysqldump --password=$MYSQL_ROOT_PASSWORD --default-character-set=utf8mb4 --no-create-db --no-create-info --skip-triggers --quick --single-transaction --tab=/tmp/$1 $1

rm -rf /dump/$1
mv /tmp/$1 dump/$1

for file in /dump/$1/*.txt
do
  if [[ -f $file ]]; then
	  gzip $file
  fi
done

chmod 755 /dump/$1
chmod 644 /dump/$1/*
chown -R root:root /dump/$1


