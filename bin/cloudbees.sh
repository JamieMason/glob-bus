#!/bin/bash
curl -s -o use-node https://repository-cloudbees.forge.cloudbees.com/distributions/ci-addons/node/use-node
NODE_VERSION=0.8.11 \
 source ./use-node
export PHANTOMJS_BIN=$WORKSPACE/bin/phantomjs
testacular --version >/dev/null 2>&1 || { npm install -g testacular@canary; }
testacular start
