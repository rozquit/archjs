#!/bin/bash

export NODE_ENV=production

sh etc/scripts/config.sh production

rollup -c

node dist/server.js
