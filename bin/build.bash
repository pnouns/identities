#!/bin/bash

NC='\033[0m'
CYAN='\033[0;36m'

function logRun() {
  task=$1
  echo -e "${CYAN}Running $1${NC}"
}

function logStart() {
  package="$1"
  echo -e "${CYAN}Building $package${NC}"
}

set -e

if [ "$NODE_ENV" == "production" ]; then
  logStart "@idfyi/website"
  yarn workspace @idfyi/website build
fi

logStart "@idfyi/dto"
yarn tsc --build packages/dto/tsconfig.json

logStart "@idfyi/client"
yarn tsc --build packages/api-client/tsconfig.json

logStart "@idfyi/react"
yarn tsc --build packages/react-client/tsconfig.json

logStart "prebuild scripts"
yarn tsc --build prebuild.tsconfig.json

logRun "prebuild"
yarn node prebuild.js

logStart "Jakefile"
yarn tsc --build jake.tsconfig.json

logRun "jake"
yarn jake
