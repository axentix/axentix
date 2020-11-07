(() => {
  /**
   * Class Dropdown
   * @class
   */
  class Dropdown extends AxentixComponent {
    static getDefaultOptions() {
      return {
        animationDuration: 300,
        animationType: 'none',
        hover: false,
        autoClose: true,
        preventViewport: false,
      };
    }

    /**
     * Construct Dropdown instance
     * @constructor
     * @param {String} element
     * @param {Object} options
     */
    constructor(element, options, isLoadedWithData) {
      super();

      try {
        this.preventDbInstance(element);
        Axentix.instances.push({ type: 'Dropdown', instance: this });

        this.el = document.querySelector(element);

        this.options = Axentix.getComponentOptions('Dropdown', options, this.el, isLoadedWithData);

        this._setup();
      } catch (error) {
        console.error('[Axentix] Dropdown init error', error);
      }
    }

    /**
     * Setup component
     */
    _setup() {
      Axentix.createEvent(this.el, 'dropdown.setup');

      this.dropdownContent = this.el.querySelector('.dropdown-content');
      this.dropdownTrigger = this.el.querySelector('.dropdown-trigger');
      this.isAnimated = false;
      this.isActive = this.el.classList.contains('active') ? true : false;

      this.options.hover ? this.el.classList.add('active-hover') : this._setupListeners();

      this.options.preventViewport ? this.el.classList.add('dropdown-vp') : '';

      this._setupAnimation();
    }

    /**
     * Setup listeners
     */
    _setupListeners() {
      if (this.options.hover) {
        return;
      }

      this.listenerRef = this._onClickTrigger.bind(this);
      this.dropdownTrigger.addEventListener('click', this.listenerRef);

      this.documentClickRef = this._onDocumentClick.bind(this);
      document.addEventListener('click', this.documentClickRef, true);
    }

    /**
     * Remove listeners
     */
    _removeListeners() {
      if (this.options.hover) {
        return;
      }

      this.dropdownTrigger.removeEventListener('click', this.listenerRef);
      this.listenerRef = undefined;

      document.removeEventListener('click', this.documentClickRef, true);
      this.documentClickRef = undefined;
    }

    /**
     * Check and init animation
     */
    _setupAnimation() {
      const animationList = ['none', 'fade'];
      this.options.animationType = this.options.animationType.toLowerCase();
      animationList.includes(this.options.animationType) ? '' : (this.options.animationType = 'none');

      if (this.options.animationType !== 'none' && !this.options.hover) {
        if (this.options.hover) {
          this.el.style.animationDuration = this.options.animationDuration + 'ms';
        } else {
          this.el.style.transitionDuration = this.options.animationDuration + 'ms';
        }
        this.el.classList.add('anim-' + this.options.animationType);
      }
    }

    /**
     * Handle click on document click
     */
    _onDocumentClick(e) {
      if (e.target.matches('.dropdown-trigger')) {
        return;
      }

      if (this.isAnimated || !this.isActive) {
        return;
      }

      this.close();
    }

    /**
     * Handle click on trigger
     */
    _onClickTrigger(e) {
      e.preventDefault();
      if (this.isAnimated) {
        return;
      }

      this.isActive ? this.close() : this.open();
    }

    _autoClose() {
      Axentix.getInstanceByType('Dropdown').map((dropdown) => {
        dropdown.el.id !== this.el.id ? dropdown.close() : '';
      });
    }

    _setContentHeight() {
      const elRect = this.dropdownContent.getBoundingClientRect();

      const bottom =
        elRect.height - (elRect.bottom - (window.innerHeight || document.documentElement.clientHeight)) - 10;

      this.dropdownContent.style.maxHeight = bottom + 'px';
    }

    /**
     * Open dropdown
     */
    open() {
      if (this.isActive) {
        return;
      }
      Axentix.createEvent(this.el, 'dropdown.open');
      this.dropdownContent.style.display = 'flex';

      this.options.preventViewport ? this._setContentHeight() : '';

      setTimeout(() => {
        this.el.classList.add('active');
        this.isActive = true;
      }, 10);

      this.options.autoClose ? this._autoClose() : '';

      if (this.options.animationType !== 'none') {
        this.isAnimated = true;
        setTimeout(() => {
          this.isAnimated = false;
          Axentix.createEvent(this.el, 'dropdown.opened');
        }, this.options.animationDuration);
      } else {
        Axentix.createEvent(this.el, 'dropdown.opened');
      }
    }

    /**
     * Close dropdown
     */
    close() {
      if (!this.isActive) {
        return;
      }
      Axentix.createEvent(this.el, 'dropdown.close');
      this.el.classList.remove('active');

      if (this.options.animationType !== 'none') {
        this.isAnimated = true;
        setTimeout(() => {
          this.dropdownContent.style.display = '';
          this.isAnimated = false;
          this.isActive = false;
          Axentix.createEvent(this.el, 'dropdown.closed');
        }, this.options.animationDuration);
      } else {
        this.dropdownContent.style.display = '';
        this.isAnimated = false;
        this.isActive = false;
        Axentix.createEvent(this.el, 'dropdown.closed');
      }
    }
  }

  Axentix.Config.registerComponent({
    class: Dropdown,
    name: 'Dropdown',
    dataDetection: true,
    autoInit: {
      enabled: true,
      selector: '.dropdown:not(.no-axentix-init)',
    },
  });
})();
