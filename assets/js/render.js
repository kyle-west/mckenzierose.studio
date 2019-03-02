function selectTab (page) {
  $$('nav li').removeClass('active');
  $$(`nav li[name=${page}]`).addClass('active');
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
    case "illustrations": 
      if (SITE.cache.illustrations) {
        document.querySelector('main').innerHTML = SITE.cache.illustrations;
      } else {
        SITE.cache.illustrations = renderImages(assets.illustrations, 'illustrations');
      }
      break;
    case "highlights": default: 
    if (SITE.cache.highlights) {
      document.querySelector('main').innerHTML = SITE.cache.highlights;
    } else {
      SITE.cache.highlights = renderImages(assets.highlights, 'highlights');
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

/**
 * Randomly shuffle an array
 * https://stackoverflow.com/a/2450976/1293256
 * @param  {Array} array The array to shuffle
 * @return {String}      The first item in the shuffled array
 */
var shuffle = function (array) {

	var currentIndex = array.length;
	var temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;

};