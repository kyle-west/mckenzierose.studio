((window) => {
  if (window.SITE) return;
  
  let SITE = {};

  SITE.fetch = (...args) => {
    console.log('FETCHING DATA')
    return window.fetch(...args).then(res => {
      return res.json();
    })
  }

  SITE.paths = {
    images: './assets/images/'
  }

  SITE.nav = {};
  SITE.nav.getActivePage = () => {
    if (!window.location.search) {
      SITE.nav.goto('illustrations', true);
    } else {
      return new URL(window.location.href).searchParams.get('page');
    }
  };
  SITE.nav.goto = (page, refresh = false) => {
    if (!page) return;
    if (refresh) window.location = '/?page=' + page;
    if (SITE.nav.routes.includes(page)) {
      window.history.pushState({page}, page, '/?page=' + page);
      render(window.SITE.data);
    } else {
      window.open(SITE.nav.externalRoutes[page]);
    }
  }
  SITE.nav.routes = [
    'illustrations', 'sketches'
  ];
  SITE.nav.externalRoutes = {
    etsy: 'https://www.etsy.com/shop/McKenzieRoseDesign',
    instagram: 'https://www.instagram.com/mckenzierose_design/'
  };

  window.addEventListener('popstate', (e) => {
    if (e.state.page) {
      render(window.SITE.data);
    }
  })

  window.SITE = SITE;
})(window);