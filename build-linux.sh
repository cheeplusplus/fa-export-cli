#!/bin/bash

npm install
npm install --no-save postject
npm run build
node --experimental-sea-config sea-config.json
cp $(command -v node) build/fa-export-cli-linux
npx postject build/fa-export-cli-linux NODE_SEA_BLOB build/sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2