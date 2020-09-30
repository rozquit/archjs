#!/bin/bash

LG='\033[1;32m'
NC='\033[0m'

echo "${LG}
      ##          ##
        ##      ##
      ##############
    ####  ######  ####
  ######################
  ##  ##############  ##
  ##  ##          ##  ##
        ####  ####
${NC}"

echo "${RAA}${LG}[arch] v0.1.0${NC}"

ENV=${1}

export NODE_ENV="$ENV"

# shellcheck disable=SC1090
set -a [ -f ./"$ENV".env ] && . ./"$ENV".env && set +

CONFIG=${CONFIG}/index.js

if [ "$ENV" = "production" ]; then
  echo "${RAA}${LG}[arch] creating production config${NC}"

  awk -F= -v q="'" -v z='' -v d=' = ' -v t='exports.' '
  /^[A-Z]/{
  gsub(/'\''|'\"'/,"", $2);
  printf t $1 d;
  printf length($2) ? tolower($2) ~ /true|false|null|^[0-9]*$/ ? tolower($2) : q $2 q : "null";
  print z;}' "$ENV".env >"${CONFIG}"
else
  echo "${LG}[arch] creating development config${NC}"

  awk -F= -v q="'" -v z='' -v d=' = ' -v t='exports.' '
  /^[A-Z]/{
  gsub(/'\''|'\"'/,"", $2);
  printf t $1 d;
  printf length($2) ? tolower($2) ~ /true|false|null|^[0-9]*$/ ? tolower($2) : q $2 q : "null";
  print z;}' "$ENV".env >"${CONFIG}"
fi
