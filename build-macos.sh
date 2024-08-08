#!/bin/bash

npm install
npm install --no-save postject
npm run build
node --experimental-sea-config sea-config.json
cp $(command -v node) build/fa-export-cli
codesign --remove-signature build/fa-export-cli 
npx postject build/fa-export-cli NODE_SEA_BLOB build/sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 --macho-segment-name NODE_SEA
codesign --sign - build/fa-export-cli
