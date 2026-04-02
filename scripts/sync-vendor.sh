#!/usr/bin/env bash
set -euo pipefail

rm -rf vendor/@azure
mkdir -p vendor/@azure/msal-browser vendor/@azure/msal-common

cp -R node_modules/@azure/msal-browser/dist vendor/@azure/msal-browser/
cp -R node_modules/@azure/msal-common/dist vendor/@azure/msal-common/
