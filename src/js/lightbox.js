(() => {
  /**
   * Class lightbox
   * @class
   */

  class Lightbox extends AxentixComponent {
    static getDefaultOptions() {
      return {
        overlay: true,
        overlayColor: 'grey dark-4',
        caption: '',
        //   bodyScrolling: false,
        animationDuration: 400,
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

      Axentix.instances.push({ type: 'Lightbox', instance: this });

      this.el = document.querySelector(element);

      this.options = Axentix.getComponentOptions('Lightbox', options, this.el, isLoadedWithData);

      this._setup();
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
      this.openOnClickRef = this._setActiveLightbox.bind(this);
      this.el.addEventListener('click', this.openOnClickRef);

      this.onResizeRef = this._updatePosition.bind(this);
      window.addEventListener('resize', this.onResizeRef);

      this.closeEventRef = this._unsetActiveLightbox.bind(this);
      window.addEventListener('keyup', this.closeEventRef);
      window.addEventListener('scroll', this.closeEventRef);
      window.addEventListener('resize', this.closeEventRef);
    }

    /**
     * Remove event listeners
     */
    _removeListeners() {
      window.removeEventListener('keyup', this.closeEventRef);
      window.removeEventListener('scroll', this.closeEventRef);
      window.removeEventListener('resize', this.closeEventRef);
    }

    /**
     * Set position of active lightbox
     */
    _setActiveLightbox() {
      if (this.el.classList.contains('active')) {
        this._unsetActiveLightbox();
        return;
      }

      const rect = this.el.getBoundingClientRect();
      this.top = rect.top;
      this.left = rect.left;
      this.basicWidth = rect.width;
      this.basicHeight = rect.height;

      const centerTop = window.innerHeight / 2;
      const centerLeft = window.innerWidth / 2;

      this.el.style.top = centerTop + 'px';
      this.el.style.left = centerLeft + 'px';

      this.container.style.position = 'relative';
      this.container.style.width = this.basicWidth;
      this.container.style.height = this.basicHeight;

      this.el.classList.add('active');
    }

    /**
     * Unset active lightbox
     */
    _unsetActiveLightbox() {
      this.el.classList.remove('active');

      setTimeout(() => {
        this.el.style.position = '';
      }, this.options.animationDuration);

      this.el.style.top = this.top;
      this.el.style.left = this.left;

      this.container.style.width = '';
      this.container.style.height = '';
    }

    /**
     * Reset basic position on resize event
     */
    _updatePosition() {
      const rect = this.el.getBoundingClientRect();
      this.el.style.top = this.top = rect.top;
      this.el.style.left = this.left = rect.left;
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
