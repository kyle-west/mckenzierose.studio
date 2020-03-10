rm index.html main.css main.js 2>/dev/null

python3 _scripts/build-html.py

if [ "$1" == "--production" ]; then
  echo "Creating Production Build..."
  node _scripts/combine-assets.js $*
else
  echo "Skipping Production Build."
fi