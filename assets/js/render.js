function selectTab (page) {
  $$('nav li').removeClass('active');
  $$(`nav li[name=${page}]`).addClass('active');
}

function conditionalRender (assets, page) {
  if (SITE.cache[page]) {
    document.querySelector('main').innerHTML = SITE.cache[page];
  } else {
    SITE.cache[page] = renderImages(assets[page], page);
  }
}

function render (assets) {
  let page = getPage();
  selectTab(page);
  switch (page) {
    case "contact":
      if (SITE.cache.contact) {
        document.querySelector('main').innerHTML = SITE.cache.contact;
      } else {
        SITE.fetchTEXT(SITE.paths.html + 'contact.html').then(renderContactPage);
      }
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

function renderContactPage (html) {
  document.querySelector('main').innerHTML = html;
  SITE.cache.contact = html;
}

function renderImages (images, type) {
  console.log(`renderImages: calculating renderables for '${type}'`)
  let colOpen = false;
  let interval = Math.floor(images.length / 2.5);
  html = '<div class="illustration-wrapper row"><div class="column">';
  images.forEach((image, idx) => {
    if (idx > 0 && idx % interval === 0) {
      html += "</div><div class='column'>";
    }

    html += `<img class="" src="${SITE.assets.meta.minPaths[type]}/${image}">`;
  });
  html += '</div></div>';

  document.querySelector('main').innerHTML = html;
  return html;
}
