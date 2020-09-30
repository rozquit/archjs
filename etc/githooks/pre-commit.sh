#!/bin/bash

# git config core.hooksPath etc/githooks

function xargs-r() {
  if IFS= read -r -d $'\n' path; then
    { echo "$path"; cat; } | xargs $@
  fi
}

git diff --name-only --cached --relative | grep '\.js\?$' | sed 's/[^[:alnum:]]/\\&/g' | xargs-r -E '' -t standard

if [[ $? -ne 0 ]]; then
  echo 'JavaScript Standard Style errors were detected. Aborting commit.'
  exit 1
fi
