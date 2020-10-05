#!/bin/bash

export NODE_ENV=development

sh etc/scripts/config.sh development

rollup -c -w
