class Aggregate {
  constructor(nodeList) {
    this.nodes = [...nodeList];
  }

  click (fn) {
    this.nodes.forEach(node => {
      node.addEventListener('click', () => {
        fn(node);
      });
    });
  }
  
  addClass (className) {
    this.nodes.forEach(node => {
      node.classList.add(className);
    });
  }

  removeClass (className) {
    this.nodes.forEach(node => {
      node.classList.remove(className);
    });
  }

  toggleClass (className) {
    this.nodes.forEach(node => {
      if (node.classList.contains(className)) {
        node.classList.remove(className);
      } else {
        node.classList.add(className);
      }
    });
  }
}

window.$$ = (query) => {
  return new Aggregate(document.querySelectorAll(query));
}