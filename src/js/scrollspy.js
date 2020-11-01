(() => {
  /**
   * Class ScrollSpy
   * @class
   */
  class ScrollSpy extends AxentixComponent {
    static getDefaultOptions() {
      return {
        offset: 200,
        linkSelector: 'a',
        classes: 'active',
        auto: {
          enabled: false,
          classes: '',
          selector: '',
        },
      };
    }

    /**
     * Construct ScrollSpy instance
     * @constructor
     * @param {String} element
     * @param {Object} options
     */
    constructor(element, options, isLoadedWithData) {
      super();

      try {
        this.preventDbInstance(element);
        Axentix.instances.push({ type: 'ScrollSpy', instance: this });

        this.el = document.querySelector(element);

        this.options = Axentix.getComponentOptions('ScrollSpy', options, this.el, isLoadedWithData);

        this._setup();
      } catch (error) {
        console.error('[Axentix] ScrollSpy init error', error);
      }
    }

    /**
     * Setup component
     */
    _setup() {
      Axentix.createEvent(this.el, 'scrollspy.setup');
      this.options.auto.enabled ? this._setupAuto() : this._setupBasic();
      this.options.classes = this.options.classes.split(' ');
      this.oldLink = '';

      this._setupListeners();
      this._update();
    }

    /**
     * Setup listeners
     */
    _setupListeners() {
      this.updateRef = this._update.bind(this);
      window.addEventListener('scroll', this.updateRef);
      window.addEventListener('resize', this.updateRef);
    }

    /**
     * Remove listeners
     */
    _removeListeners() {
      window.removeEventListener('scroll', this.updateRef);
      window.removeEventListener('resize', this.updateRef);
      this.updateRef = undefined;
    }

    _setupBasic() {
      this.links = Array.from(this.el.querySelectorAll(this.options.linkSelector));
      this.elements = this.links.map((link) => document.querySelector(link.getAttribute('href')));
    }

    _setupAuto() {
      this.elements = Array.from(document.querySelectorAll(this.options.auto.selector));
      this.links = this.elements.map((el) => {
        const link = document.createElement('a');
        link.className = this.options.auto.classes;
        link.setAttribute('href', '#' + el.id);
        link.innerHTML = el.innerHTML;
        this.el.appendChild(link);

        return link;
      });
    }

    _getElement() {
      const top = window.scrollY,
        left = window.scrollX,
        right = window.innerWidth,
        bottom = window.innerHeight,
        topBreakpoint = top + this.options.offset;

      if (bottom + top >= document.body.offsetHeight - 2) {
        return this.elements[this.elements.length - 1];
      }

      return this.elements.find((el) => {
        const elRect = el.getBoundingClientRect();
        return (
          elRect.top + top >= top &&
          elRect.left + left >= left &&
          elRect.right <= right &&
          elRect.bottom <= bottom &&
          elRect.top + top <= topBreakpoint
        );
      });
    }

    _removeOldLink() {
      if (!this.oldLink) {
        return;
      }
      this.options.classes.map((cl) => this.oldLink.classList.remove(cl));
    }

    _getClosestElem() {
      const top = window.scrollY;
      return this.elements.reduce((prev, curr) => {
        const currTop = curr.getBoundingClientRect().top + top;
        const prevTop = prev.getBoundingClientRect().top + top;

        return currTop > top + this.options.offset
          ? prev
          : Math.abs(currTop - top) < Math.abs(prevTop - top)
          ? curr
          : prev;
      });
    }

    _update() {
      let element = this._getElement();

      element ? '' : (element = this._getClosestElem());

      const link = this.links.find((link) => link.getAttribute('href').split('#')[1] === element.id);
      if (link === this.oldLink) {
        return;
      }
      Axentix.createEvent(this.el, 'scrollspy.update');
      this._removeOldLink();

      this.options.classes.map((cl) => link.classList.add(cl));
      this.oldLink = link;
    }
  }

  Axentix.Config.registerComponent({
    class: ScrollSpy,
    name: 'ScrollSpy',
    dataDetection: true,
    autoInit: {
      enabled: true,
      selector: '.scrollspy:not(.no-axentix-init)',
    },
  });
})();
