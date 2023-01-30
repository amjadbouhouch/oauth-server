#!/bin/bash
## get staging
if [ $1 != "staging" ] && [ $1 != "production" ]; then
echo "please pass staging build as an arg 'production' or 'staging'"
echo "./build.sh production || ./build.sh staging"
exit 1;
fi
STAGING=$1
echo "building oauth-server/admin-console for $STAGING"

# Tagging based on package.json version
PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

BASE=oauth-server/admin-console/$STAGING
echo "BASE registry $BASE"

TAG=$PACKAGE_VERSION

docker build  --build-arg STAGING=$STAGING --rm -t $BASE:$TAG -t $BASE:latest . || { echo "Docker operation failed $TAG"; exit 1; }
echo "build done." && sleep 1
