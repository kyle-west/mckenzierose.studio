const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const minifier = require('node-minify');
const fs = require('fs')
const config = require('./config.json')

const jsCompressor = process.env.JS_COMPRESSOR || config.jsCompressor
const cssCompressor = process.env.CSS_COMPRESSOR || config.cssCompressor

const isDebugBuild = process.env.DEBUG === 'true'
isDebugBuild ? console.log(`isDebugBuild: ${isDebugBuild}`) : console.log(`Building with: ${jsCompressor} and ${cssCompressor}`)

const handleWith = (cb) => (err, value) => {
  if (err) throw err;
  cb((value && value.toString) ? value.toString() : value)
}

const isLocalAsset = (asset) => asset && asset.startsWith('./assets/')

const fileTopComment = (name) => `/******************************************************************************
*     ${name}
******************************************************************************/

`

const globularize = (input, output, compressor) => {
  if (isDebugBuild) {
    const sizes = {}
    const content = input.map(file => {
      const content = fs.readFileSync(file).toString()
      sizes[file] = content.length
      return fileTopComment(file) + content
    }).join('\n\n\n')
    console.table(sizes)
    console.log(`STATS: *${output.match(/\.\w+$/)[0]} requests:${input.length} size:${Object.values(sizes).reduce((a = 0, c) => a + c)}`)
    fs.writeFile(output, content, handleWith(() => console.log('write:', output)))
  } else {
    return minifier.minify({
      input,
      output,
      compressor,
      callback: handleWith(() => console.log('write:', output))
    });
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
  
  globularize(src.js.map(x => x.src), './main.js', jsCompressor)
  globularize(src.css.map(x => x.href), './main.css', cssCompressor)

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
  fs.writeFile(indexHTML, manipulatedHTML, handleWith(() => {
    if (isDebugBuild) {
      console.log('write:', indexHTML)
    } else {
      minifier.minify({
        input: indexHTML,
        output: indexHTML,
        compressor: 'html-minifier',
        callback: handleWith(() => console.log('write:', indexHTML))
      })
    }
  }))
}))