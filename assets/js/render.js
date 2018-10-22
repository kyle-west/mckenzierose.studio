function selectTab (page) {
  $$('nav li').removeClass('active');
  $$(`nav li[name=${page}]`).addClass('active');
}

function render (data) {
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
    case "sketches":
      if (SITE.cache.sketches) {
        document.querySelector('main').innerHTML = SITE.cache.sketches;
      } else {
        SITE.cache.sketches = renderIllustrations(data.sketches);
      }
      break;
    case "illustrations": default: 
    if (SITE.cache.illustrations) {
      document.querySelector('main').innerHTML = SITE.cache.illustrations;
    } else {
      SITE.cache.illustrations = renderIllustrations(data.illustrations);
    }
  }
}


function getPage () {
  return SITE.nav.getActivePage();
}

function renderContactPage (html) {
  document.querySelector('main').innerHTML = html;
  SITE.cache.contact = html;
}

function renderIllustrations (items) {
  console.log('renderIllustrations: calculating renderables again')
  html = '';
  items.forEach(item => {
    let name  = (item.name)      ? `<h3 class="title">${item.name}</h3>` : '';
    let image = (item.imageName) ? `<img src='${SITE.paths.images + item.imageName}'/>` : '';
    let date  = (item.date)      ? `<p class="date">${item.date}</p>`: '';
    let media = (item.media)     ? `<p class="media">${item.media}</p>`: '';

    let instagram = (item.instagram) ? `
      <a target="_blank" href="${item.instagram}"><i class="icon instagram"></i></a>
    ` : '' 
    let etsy = (item.etsy) ? `
      <a target="_blank" href="${item.etsy}"><i class="icon etsy"></i></a>
    ` : '' 
    
    html += `<section class="illustration">
      <div class='item'>
        <div class='data'>
          ${image}
        </div>
        <div class='data'>
          ${name}
          ${media}
          ${date}
          ${etsy}
          ${instagram}
        </div>
      </div>
    </section>`;
  });

  document.querySelector('main').innerHTML = html;
  return html;
}