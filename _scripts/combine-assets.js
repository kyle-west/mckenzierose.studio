const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const minifier = require('node-minify');

const isProductionBuild = process.argv.includes('--production')

console.log(`isProductionBuild: ${isProductionBuild}`)

const fs = require('fs')

const handleWith = (cb) => (err, value) => {
  if (err) throw err;
  cb((value && value.toString) ? value.toString() : value)
}

const isLocalAsset = (asset) => asset && asset.startsWith('./assets/')


const globularize = (input, output, compressor) => {
  if (isProductionBuild) {
    return minifier.minify({
      input,
      output,
      compressor,
      callback: handleWith(() => console.log('write:', output))
    });
  } else {
    const content = input.map(x => fs.readFileSync(x).toString()).join('\n/************/\n')
    fs.writeFile(output, content, handleWith(() => console.log('write:', output)))
  }
}

const indexHTML = './index.html'

fs.readFile(indexHTML, handleWith(raw => {
  const dom = (new JSDOM(raw));
  const { document } = dom.window;
  const headElems = [...document.head.children];
  const src = {};
  src.js = headElems.filter(x => x.tagName === "SCRIPT" && isLocalAsset(x.src))
  src.css = headElems.filter(x => x.tagName === "LINK" && isLocalAsset(x.href))
  
  globularize(src.js.map(x => x.src), './main.js', 'gcc')
  globularize(src.css.map(x => x.href), './main.css', 'crass')

  src.js.forEach(x => x.removeAttribute('src'))
  src.css.forEach(x => {
    x.removeAttribute('href');
    x.removeAttribute('rel');
  })

  const srcElem = document.createElement('script')
  srcElem.src = './main.js'
  document.head.appendChild(srcElem)

  const linkElem = document.createElement('link')
  linkElem.href = './main.css'
  linkElem.rel = 'stylesheet'
  document.head.appendChild(linkElem)


  const manipulatedHTML = dom.serialize().replace(/\n<script><\/script>/g, '').replace(/\n(<link)[/]?(>)/g, '')
  fs.writeFile(indexHTML, manipulatedHTML, handleWith(() => console.log('write:', indexHTML)))
}))