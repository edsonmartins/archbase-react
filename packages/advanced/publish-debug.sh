#!/bin/bash
VERDACCIO_URL="http://localhost:4873"
PACKAGE_NAME=$(node -p "require('./package.json').name")
CURRENT_VERSION=$(node -p "require('./package.json').version")
DEBUG_VERSION="${CURRENT_VERSION}-debug.$(date +%Y%m%d%H%M%S)"

echo "🚀 Publicando ${PACKAGE_NAME}@${DEBUG_VERSION}..."

cp package.json package.json.backup

node -e "
const pkg = require('./package.json');
pkg.version = '${DEBUG_VERSION}';
pkg.files = ['dist', 'src'];
pkg.publishConfig = { registry: '${VERDACCIO_URL}' };
require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

./build-debug.sh
npm publish --registry="${VERDACCIO_URL}"

cp package.json.backup package.json
rm package.json.backup
