function selectTab (page) {
  $$('nav li').removeClass('active');
  $$(`nav li[name=${page}]`).addClass('active');
  let subPage = document.querySelector(`nav li[name=${page}]`).innerText.trim()
  document.title = `McKenzie Rose Studio | ${subPage}`
}

function conditionalRender (assets, page, selector = 'main') {
  const contents = SITE.cache[page] || renderImages(assets[page], page)
  SITE.cache[page] = contents
  return onlyChild(document.querySelector(selector), contents)
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

function renderImages (images, type) {
  return make('div', { className: 'masonry', 
    children: images.map(image => make('image-thumbnail', { type, image, className: 'brick' }))
  });
}
