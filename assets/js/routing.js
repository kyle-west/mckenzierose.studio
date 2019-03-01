// Ensure we are on a secure connection when in live environment
((loc) => {
  switch (loc.hostname) {
    case "localhost": return;
    default:
      if (loc.protocol !== "https:") {
        loc.href = `https://${loc.host}${loc.pathname}${loc.search}`
      }
  }
})(window.location);

import {ClientRouter} from '/lib/client-router.js';
let router = new ClientRouter({debug:true});
router.registerOn(window);