npm install
npm install --no-save postject
npm run build
node --experimental-sea-config sea-config.json 
node -e "require('fs').copyFileSync(process.execPath, 'build/fa-export-cli.exe')" 
C:\"Program Files (x86)\Windows Kits\10\App Certification Kit"\signtool.exe remove /s build\fa-export-cli.exe
npx postject build/fa-export-cli.exe NODE_SEA_BLOB build/sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2
# C:\"Program Files (x86)\Windows Kits\10\App Certification Kit"\signtool.exe sign /fd SHA256 build\fa-export-cli.exe
