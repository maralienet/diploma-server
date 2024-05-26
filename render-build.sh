#!/usr/bin/env bash
# exit on error
set -o errexit

# Set the cache directories if they're not already set
export PUPPETEER_CACHE_DIR=${PUPPETEER_CACHE_DIR:-'/opt/render/project/puppeteer/'}
export XDG_CACHE_HOME=${XDG_CACHE_HOME:-'/opt/render/.cache/'}

npm install
# npm run build # uncomment if required

# Store/pull Puppeteer cache with build cache
if [[ ! -d $PUPPETEER_CACHE_DIR ]]; then 
  echo "...Copying Puppeteer Cache from Build Cache" 
  cp -R $XDG_CACHE_HOME/puppeteer/ $PUPPETEER_CACHE_DIR
else 
  echo "...Storing Puppeteer Cache in Build Cache" 
  cp -R $PUPPETEER_CACHE_DIR $XDG_CACHE_HOME
fi