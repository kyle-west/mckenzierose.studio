filesize () {
  wc -c "$1" | awk '{print $1}'
}

__analysis () {
  sh _scripts/build.sh --silent

  echo '======================================================='
  echo '   Pre-build Stats'
  echo '-------------------------------------------------------'
  preStats=$(
    htmlSizePre=`filesize ./index.html`;
    DEBUG=true npm run build:prod | grep STATS | awk '{print $2, $3, $4}';
    echo "index.html requests:1 size:${htmlSizePre}B";
  )
  node -e "
    let raw = \`$preStats\`;
    let data = raw.split('\n').map(r => Object.fromEntries(r.split(' ').map(c => c.includes(':') ? c.split(':') : ['file', c])));
    let reqTotal = 0;
    let sizeTotal = 0;
    let flatData = Object.fromEntries(data.map(({requests, size, file }) => {
      let r = parseInt(requests, 10);
      reqTotal += r;
      let s = parseInt(size, 10);
      sizeTotal += s;
      return [ file, { requests: r, size: s } ]
    }))
    console.table(flatData);
    console.log('Total Requests:', reqTotal, '| Total Size:', sizeTotal)
  "
  echo '======================================================='
  echo;
  echo '======================================================='
  echo '   Post-build Stats'
  echo '-------------------------------------------------------'
  JS_COMPRESSOR="$1" CSS_COMPRESSOR="$2" npm run build:prod >/dev/null
  htmlSizePost=`filesize ./index.html`
  jsSizePost=`filesize ./main.js`
  cssSizePost=`filesize ./main.css`
  node -e "
    console.table({
      'main.js' : { requests: 1, size: ${jsSizePost} },
      'main.css' : { requests: 1, size: ${cssSizePost} },
      'index.html' : { requests: 1, size: ${htmlSizePost} },
    })
    console.log('Total Requests:', 3, '| Total Size:', ${htmlSizePost} + ${jsSizePost} + ${cssSizePost})
  "
  echo '======================================================='
  echo;
  echo;

  node -e "
    let postSize = ${htmlSizePost} + ${jsSizePost} + ${cssSizePost};
    let pre = \`$preStats\`
      .split('\n')
      .map(r => Object.fromEntries(r.split(' ').map(c => c.split(':'))))
      .reduce((a, {requests, size}) => ({requests: parseInt(requests, 10) + a.requests, size: parseInt(size, 10) + a.size}), {size:0, requests:0})
    console.log('----- Savings -----')
    console.log(pre.requests - 3, 'less requests |', pre.size - postSize, 'less data usage')
    console.log(\`\${(3*100/pre.requests).toFixed(1)}% of the number of assets\`) 
    console.log(\`\${((pre.size-postSize)*100/pre.size).toFixed(1).padStart(4, '0')}% total data compression \${('$1' && '$2') ? '(with compressors JS->$1, CSS->$2)' : ''}\`)
  "
}

#####################################################
JS_Compressors="""
  babel-minify
  gcc
  terser
  yui
"""
CSS_Compressors="""
  clean-css
  crass
  sqwish
  yui
"""
#####################################################

if [ "$1" == "--all" ]; then
  for js in $JS_Compressors; do
    for css in $CSS_Compressors; do
      echo "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%";
      echo "%%%        JS:$js CSS:$css";
      echo "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%";
      __analysis $js $css;
      echo "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%";
      echo;
      echo;
      echo;
      echo;
      echo;
      echo;
    done;
  done;
else
  __analysis;
fi