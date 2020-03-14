rm index.html main.css main.js 2>/dev/null

python3 _scripts/build-html.py

if [ "$1" == "--production" ]; then
  [ "$2" != '--silent' ] && echo "Creating Production Build..."
  node _scripts/combine-assets.js $*
else
  [ "$1" != '--silent' ] && echo "Skipping Production Build."
fi