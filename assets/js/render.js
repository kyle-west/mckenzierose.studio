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

const pageDividerIntervals = {
  'illustrations' : 2.5,
  'animals' : 2.5,
}

function renderImages (images, type, selector = 'main') {
  console.log(`renderImages: calculating renderables for '${type}'`)
  let colOpen = false;
  let interval = Math.floor(images.length / (pageDividerIntervals[type] || 3));
  html = '<div class="illustration-wrapper row"><div class="column">';
  images.forEach((image, idx) => {
    if (idx > 0 && idx % interval === 0) {
      html += "</div><div class='column'>";
    }

    let [name] = image.split('.')
    let altText = `${humanReadable(window.getPage())}: ${humanReadable(name)}`
    html += `<img alt="${altText}" class="showcase-image" src="${SITE.assets.meta.minPaths[type]}/${image}" tabindex="0">`;
  });
  html += '</div></div>';

  document.querySelector(selector).innerHTML = html;
  return html;
}
