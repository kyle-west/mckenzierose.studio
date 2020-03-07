function selectTab (page) {
  $$('nav li').removeClass('active');
  $$(`nav li[name=${page}]`).addClass('active');
  let subPage = document.querySelector(`nav li[name=${page}]`).innerText.trim()
  document.title = `McKenzie Rose Studio | ${subPage}`
}

function conditionalRender (assets, page) {
  if (SITE.cache[page]) {
    document.querySelector('main').innerHTML = SITE.cache[page];
  } else {
    SITE.cache[page] = renderImages(assets[page], page);
  }
}

function conditionalStaticPageRender(page) {
  if (SITE.cache[page]) {
    document.querySelector('main').innerHTML = SITE.cache[page];
  } else {
    SITE.fetchTEXT(`${SITE.paths.html}${page}.html`).then((html) => {
      SITE.cache[page] = html;
      return html
    }).then(renderStaticPage)
  }
}

function render (assets) {
  let page = getPage();
  selectTab(page);
  switch (page) {
    case "contact":
    case "character-design":
      conditionalStaticPageRender(page)
      break;
    default: conditionalRender(assets, page)
  }

  gtag && gtag('config', 'UA-136826563-1', {
    'page_title' : page,
    'page_path': location.pathname + location.search
  });
}


function getPage () {
  return SITE.nav.getActivePage();
}

function renderStaticPage (html) {
  document.querySelector('main').innerHTML = html;
}

const humanReadable = str => str.replace(/-/g, ' ').split(' ').map(word => word[0].toUpperCase() + word.substr(1)).join(' ')

function renderImages (images, type, selector = 'main') {
  console.log(`renderImages: calculating renderables for '${type}'`)

  let html = '<div class="masonry">';
  images.forEach((image) => {
    let [name] = image.split('.')
    let altText = `${humanReadable(window.getPage())}: ${humanReadable(name)}`
    html += `<div class="brick"><img alt="${altText}" src="${SITE.assets.meta.minPaths[type]}/${image}" tabindex="0"></div>`;
  });
  html += '</div>';


  document.querySelector(selector).innerHTML = html;
  return html;
}
