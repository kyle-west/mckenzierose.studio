((window) => {
  const humanReadable = str => str.replace(/-/g, ' ').split(' ').map(word => word[0].toUpperCase() + word.substr(1)).join(' ');

  const { SITE, make } = window;
  const ELEMENT_TAG = 'image-thumbnail';

  class ImageThumbnail extends HTMLElement {
    connectedCallback () {
      this.style.display = 'block';
      this.childConstructed = false;

      this.render()
    }

    render () {
      const { image, type } = this

      if (image && type && this.children && !this.children.length) {
        const [name] = image.split('.');
  
        const alt = `${humanReadable(window.getPage())}: ${humanReadable(name)}`;
        const src = `${SITE.assets.meta.minPaths[type]}/${image}`    ;  
        this.appendChild(make('img', { alt, src }, { tabindex:0 }));
        this.childConstructed = true;
      }

      this.bindListeners()
      return this 
    }

    bindListeners () {
      [...this.querySelectorAll('img')].forEach(img => {
        img.onclick = () => document.querySelector('image-carousel').show(img);
      })
    }
  }

  if ('customElements' in window) {
    customElements.define(ELEMENT_TAG, ImageThumbnail);
  } else {
    document.registerElement(ELEMENT_TAG, {prototype: Object.create(ImageThumbnail.prototype)});
  }

})(window);