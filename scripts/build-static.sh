#!/usr/bin/env bash
set -euo pipefail

rm -rf dist
mkdir -p dist/src/auth dist/src/store dist/vendor/@azure/msal-browser dist/vendor/@azure/msal-common

cp index.html dist/index.html
cp src/main.js dist/src/main.js
cp src/style.css dist/src/style.css
cp src/app-config.js dist/src/app-config.js
cp src/auth/config.js dist/src/auth/config.js
cp src/auth/service.js dist/src/auth/service.js
cp src/auth/msalClients.js dist/src/auth/msalClients.js
cp src/store/auth.js dist/src/store/auth.js

cp -R node_modules/@azure/msal-browser/dist dist/vendor/@azure/msal-browser/
cp -R node_modules/@azure/msal-common/dist dist/vendor/@azure/msal-common/

perl -pi -e 's|\./node_modules/\@azure/msal-browser/dist|\./vendor/\@azure/msal-browser/dist|g' dist/index.html
perl -pi -e 's|\./node_modules/\@azure/msal-common/dist|\./vendor/\@azure/msal-common/dist|g' dist/index.html
