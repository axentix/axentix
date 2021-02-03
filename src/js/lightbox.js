(() => {
  /**
   * Class lightbox
   * @class
   */

  class Lightbox extends AxentixComponent {
    static getDefaultOptions() {
      return {
        animationDuration: 400,
        overlayColor: 'grey dark-4',
        offset: 150,
        mobileOffset: 80,
        caption: '',
      };
    }

    /**
     * Construct Lightbox instance
     * @constructor
     * @param {String} element
     * @param {Object} options
     */
    constructor(element, options, isLoadedWithData) {
      super();

      try {
        this.preventDbInstance(element);
        Axentix.instances.push({ type: 'Lightbox', instance: this });

        this.el = document.querySelector(element);

        this.options = Axentix.getComponentOptions('Lightbox', options, this.el, isLoadedWithData);

        this._setup();
      } catch (error) {
        console.error('[Axentix] Lightbox init error', error);
      }
    }

    /**
     * Setup component
     */
    _setup() {
      Axentix.createEvent(this.el, 'lightbox.setup');
      this.el.style.transitionDuration = this.options.animationDuration + 'ms';

      this.container = Axentix.wrap([this.el]);

      this._setupListeners();
    }

    /**
     * Setup listeners
     */
    _setupListeners() {
      this.openOnClickRef = this.open.bind(this);
      this.el.addEventListener('click', this.openOnClickRef);

      this.closeEventRef = this.close.bind(this);
      window.addEventListener('keyup', this.closeEventRef);
      window.addEventListener('scroll', this.closeEventRef);
      window.addEventListener('resize', this.closeEventRef);
    }

    /**
     * Remove event listeners
     */
    _removeListeners() {
      this.el.removeEventListener('click', this.openOnClickRef);

      window.removeEventListener('keyup', this.closeEventRef);
      window.removeEventListener('scroll', this.closeEventRef);
      window.removeEventListener('resize', this.closeEventRef);

      this.openOnClickRef = undefined;
      this.onResizeRef = undefined;
      this.closeEventRef = undefined;
    }

    _setOverlay() {
      this.overlay = document.createElement('div');
      this.overlay.style.transitionDuration = this.options.animationDuration + 'ms';
      this.overlay.className = 'lightbox-overlay ' + this.options.overlayColor;
      this.container.appendChild(this.overlay);

      if (this.options.caption) {
        this.caption = document.createElement('p');
        this.caption.className = 'lightbox-caption';
        this.caption.innerHTML = this.options.caption;
        this.overlay.appendChild(this.caption);
      }

      this.overlayClickEventRef = this.close.bind(this);
      this.overlay.addEventListener('click', this.overlayClickEventRef);
    }

    _showOverlay() {
      this.overlay.style.opacity = 1;
    }

    _unsetOverlay() {
      this.overlay.style.opacity = 0;

      this.overlay.removeEventListener('click', this.overlayClickEventRef);
      setTimeout(() => {
        this.overlay.remove();
      }, this.options.animationDuration);
    }

    _calculateRatio() {
      let offset = window.innerWidth >= 960 ? this.options.offset : this.options.mobileOffset;

      if (window.innerWidth / window.innerHeight >= this.basicWidth / this.basicHeight) {
        this.newHeight = window.innerHeight - offset;
        this.newWidth = (this.newHeight * this.basicWidth) / this.basicHeight;
      } else {
        this.newWidth = window.innerWidth - offset;
        this.newHeight = (this.newWidth * this.basicHeight) / this.basicWidth;
      }
    }

    _setOverflowParents() {
      this.overflowParents = [];
      for (let elem = this.el; elem && elem !== document; elem = elem.parentNode) {
        const elementSyle = window.getComputedStyle(elem);
        if (
          elementSyle.overflow === 'hidden' ||
          elementSyle.overflowX === 'hidden' ||
          elementSyle.overflowY === 'hidden'
        ) {
          this.overflowParents.push(elem);
          elem.style.setProperty('overflow', 'visible', 'important');
          document.body.style.overflowX = 'hidden';
        }
      }
    }

    _unsetOverflowParents() {
      this.overflowParents.map((parent) => (parent.style.overflow = ''));
      document.body.style.overflowX = '';
    }

    /**
     * Set position of active lightbox
     */
    open() {
      if (this.isActive) {
        this.close();
        return;
      } else if (this.isAnimated) {
        return;
      }

      let element = this.el;
      this.overflowElements = [];

      this._setOverflowParents();

      const centerTop = window.innerHeight / 2;
      const centerLeft = window.innerWidth / 2;

      const rect = this.el.getBoundingClientRect();
      const containerRect = this.el.getBoundingClientRect();

      this.basicWidth = rect.width;
      this.el.style.width = this.basicWidth + 'px';
      this.basicHeight = rect.height;
      this.el.style.height = this.basicHeight + 'px';

      this.el.style.top = 0;
      this.el.style.left = 0;

      this.newTop = centerTop + window.scrollY - (containerRect.top + window.scrollY);
      this.newLeft = centerLeft + window.scrollX - (containerRect.left + window.scrollX);

      this._calculateRatio();

      this.container.style.position = 'relative';
      this._setOverlay();

      setTimeout(() => {
        Axentix.createEvent(this.el, 'lightbox.open');

        this.isAnimated = true;

        this.el.classList.add('active');

        if (this.el.classList.contains('responsive-media')) {
          this.el.classList.remove('responsive-media');
          this.isResponsive = true;
        } else {
          this.isResponsive = false;
        }

        this.isActive = true;

        this._showOverlay();
        this.container.style.width = this.basicWidth + 'px';
        this.container.style.height = this.basicHeight + 'px';

        this.el.style.width = this.newWidth + 'px';
        this.el.style.height = this.newHeight + 'px';
        this.el.style.top = this.newTop - this.newHeight / 2 + 'px';
        this.el.style.left = this.newLeft - this.newWidth / 2 + 'px';

        this.isAnimated = false;
      }, 50);

      setTimeout(() => {
        Axentix.createEvent(this.el, 'lightbox.opened');
      }, this.options.animationDuration + 50);
    }

    /**
     * Unset active lightbox
     */
    close(e) {
      if (!this.isActive || (e && e.key && e.key !== 'Escape')) {
        return;
      } else if (this.isAnimated) {
        return;
      }

      this.isAnimated = true;

      this.el.style.top = 0;
      this.el.style.left = 0;

      this.el.style.width = this.basicWidth + 'px';
      this.el.style.height = this.basicHeight + 'px';
      this._unsetOverlay();

      Axentix.createEvent(this.el, 'lightbox.close');

      setTimeout(() => {
        this.el.classList.remove('active');

        this.isResponsive ? this.el.classList.add('responsive-media') : '';

        this.container.removeAttribute('style');
        this.el.style.left = '';
        this.el.style.top = '';
        this.el.style.width = '';
        this.el.style.height = '';
        this.el.style.transform = '';

        this._unsetOverflowParents();

        this.isActive = false;
        this.isAnimated = false;

        Axentix.createEvent(this.el, 'lightbox.closed');
      }, this.options.animationDuration + 50);
    }
  }

  Axentix.Config.registerComponent({
    class: Lightbox,
    name: 'Lightbox',
    dataDetection: true,
    autoInit: {
      enabled: true,
      selector: '.lightbox:not(.no-axentix-init)',
    },
  });
})();
