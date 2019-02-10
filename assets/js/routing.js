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

