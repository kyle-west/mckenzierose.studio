((window) => {

  const { SITE, make } = window;
  const ELEMENT_TAG = 'image-carousel';

  class ImageCarousel extends HTMLElement {
    connectedCallback () {
      this.style.display = 'none';
      this.isOpen = false;
      this.listeners = [];

      this.showCased = make('img');

      this.appendChild(make('div', { className: 'scrim', 
        children: make('div', { className: 'image-wrapper', children: this.showCased } )
      }))

      this.appendChild(make('button', { className: 'exit', children: "X", onclick: () => this.close() }));
      this.appendChild(make('button', { className: 'next', children: ">", onclick: () => this.next() }));
      this.appendChild(make('button', { className: 'prev', children: "<", onclick: () => this.prev() }));

      this.bindListeners();
    }
    
    open () { 
      if (window.innerWidth >= 540) {
        this.isOpen = true; this.style.display = 'block';
      }
    }
    close () { this.isOpen = false; this.style.display = 'none'; }

    show ({ alt, src }) {
      this.showCased.src = src;
      this.showCased.alt = alt;

      this.open();
    }

    get pageImages () {
      return [...document.querySelectorAll('image-thumbnail img')];
    }

    prev () {
      const images = this.pageImages;
      const prevIdx = images.findIndex(({src}) => src.endsWith(this.showCased.src)) - 1;
      const prevImage = images[prevIdx] || images[images.length - 1];
      this.show(prevImage);
    }

    next () {
      const images = this.pageImages;
      const nextIdx = images.findIndex(({src}) => src.endsWith(this.showCased.src)) + 1;
      const nextImage = images[nextIdx] || images[0];
      this.show(nextImage);
    }

    bindListeners () {
      this.listeners.push([document.body, 'keyup', ({ key }) => {
        if (!this.isOpen) return;

        switch (key) {
          case 'Escape':
            this.close(); break;
          
          case 'ArrowRight':
          case 'ArrowDown':  
            this.next(); 
            break;

          case 'ArrowLeft':
          case 'ArrowUp':
            this.prev();
            break;
        }
      }])

      this.listeners.forEach(([elem, type, cb]) => elem.addEventListener(type, cb));
    }

    disconnectedCallback () {
      this.listeners.forEach(([elem, type, cb]) => elem.removeEventListener(type, cb));
    }
  }

  if ('customElements' in window) {
    customElements.define(ELEMENT_TAG, ImageCarousel);
  } else {
    document.registerElement(ELEMENT_TAG, {prototype: Object.create(ImageCarousel.prototype)});
  }

})(window);