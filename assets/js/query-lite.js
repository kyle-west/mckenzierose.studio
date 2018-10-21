class Aggregate {
  constructor(nodeList) {
    this.nodes = [...nodeList];
  }

  click (fn) {
    this.nodes.forEach(node => {
      node.addEventListener('click', () => {
        fn(node);
      });
    })
  }
}

window.$$ = (query) => {
  return new Aggregate(document.querySelectorAll(query));
}