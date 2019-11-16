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

const pageDividerIntervals = {
  'illustrations' : 2.5,
  'animals' : 2.5,
}

function renderImages (images, type) {
  console.log(`renderImages: calculating renderables for '${type}'`)
  let colOpen = false;
  let interval = Math.floor(images.length / (pageDividerIntervals[type] || 3));
  html = '<div class="illustration-wrapper row"><div class="column">';
  images.forEach((image, idx) => {
    if (idx > 0 && idx % interval === 0) {
      html += "</div><div class='column'>";
    }

    html += `<img src="${SITE.assets.meta.minPaths[type]}/${image}">`;
  });
  html += '</div></div>';

  document.querySelector('main').innerHTML = html;
  return html;
}
