#!/bin/bash

sh etc/scripts/config.sh production

npm run build

set -a [ -f ./production.env ] && . ./production.env && set +

clinic doctor --autocannon [ -c 10 ./ ] -- node "${DIST}/server.js"
