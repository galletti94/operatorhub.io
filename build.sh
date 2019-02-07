#!/bin/bash

pushd frontend
yarn
yarn build
popd
pushd server
yarn
pushd scripts
./update-operators.sh https://github.com/galletti94/community-operators-demo
popd
popd
