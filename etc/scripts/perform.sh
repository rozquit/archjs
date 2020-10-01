#!/bin/bash

URL=${1}

sh etc/scripts/config.sh production

set -a [ -f ./production.env ] && . ./production.env && set +

URI="http://${HOST}:${PORT}/${URL}"

autocannon -c 10 "${URI}"
