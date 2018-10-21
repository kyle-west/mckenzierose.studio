function render (data) {
  switch (getPage()) {
    default: 
      renderIllustrations(data.illustrations);
  }
}


function getPage () { return "TODO" }

function renderIllustrations (items) {
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
}