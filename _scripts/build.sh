rm index.html main.css main.js 2>/dev/null

if command -v python3; then 
  python3 _scripts/build-html.py
else 
  python _scripts/build-html.py
fi

if [ "$1" == "--production" ]; then
  [ "$2" != '--silent' ] && echo "Creating Production Build..."
  node _scripts/combine-assets.js $*
else
  [ "$1" != '--silent' ] && echo "Skipping Production Build."
fi