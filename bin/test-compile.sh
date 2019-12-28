#!/bin/sh

# Copy all source.js files as _source.js
for f in $(find functions/ -name source.js); do cp -- "$f" "$(dirname $f)/_$(basename $f)"; done

# Search and replace in all _source.js files
for f in $(find functions/ -name _source.js); do sed -i -e 's/exports =/module.exports =/g' $f; done