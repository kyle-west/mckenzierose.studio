((window) => {
  if (window.SITE) return;
  
  let SITE = {};

  SITE.fetch = (...args) => {
    return window.fetch(...args).then(res => {
      return res.json();
    })
  }

  SITE.paths = {
    images: './assets/images/'
  }

  window.SITE = SITE;
})(window);