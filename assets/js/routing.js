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


// Set up routes that we will handle locally
window.localizedRoutes = [
  'illustrations', 'character-design','animals', 'contact', 'black-and-white'
];

// handle deprecated or invalid routes
((loc) => {
  if (!loc.search) return

  let query;
  try {
    query = Object.fromEntries(loc.search.slice(1).split('&').map(x => x.split('=')))
  } catch (err) {
    loc.href = `${loc.protocol}//${loc.host}${loc.pathname}?page=illustrations`
  }
  
  let pageIsHandled = query.page && window.localizedRoutes.includes(query.page);
  if (pageIsHandled) return
  
  // old route handler map
  query.page = ({
    'highlights': 'illustrations'
  })[query.page] || 'illustrations' // default 


  let newQuery = Object.entries(query).map(([k,v]) => v ? `${k}=${v}` : '').join('&')

  loc.href = `${loc.protocol}//${loc.host}${loc.pathname}${newQuery ? `?${newQuery}` : ''}`
})(window.location);
