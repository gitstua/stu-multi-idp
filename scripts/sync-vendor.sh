#!/usr/bin/env bash
set -euo pipefail

mkdir -p vendor/@azure/msal-browser vendor/@azure/msal-common

cp -R node_modules/@azure/msal-browser/dist vendor/@azure/msal-browser/
cp -R node_modules/@azure/msal-common/dist vendor/@azure/msal-common/
cp -R node_modules/@azure/msal-common/dist-browser vendor/@azure/msal-common/
