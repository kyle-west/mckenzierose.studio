mkdir content
mkdir lib

# content repo data
mv node_modules/mckenzierose.studio-content/images content/images
mv node_modules/mckenzierose.studio-content/data-urls content/data-urls
mv node_modules/mckenzierose.studio-content/asset.manifest.json content/asset.manifest.json

# ClientRouter
mv node_modules/client-router/client-router.js lib/client-router.js


rm -rf node_modules