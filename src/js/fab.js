(() => {
  /**
   * Class Fab
   * @class
   */
  class Fab extends AxentixComponent {
    static getDefaultOptions() {
      return {
        animationDuration: 300,
        hover: true,
        direction: 'top',
        position: 'bottom-right',
        offsetX: '1rem',
        offsetY: '1.5rem',
      };
    }

    /**
     * Construct Fab instance
     * @constructor
     * @param {String} element
     * @param {Object} options
     */
    constructor(element, options, isLoadedWithData) {
      super();

      try {
        this.preventDbInstance(element);
        Axentix.instances.push({ type: 'Fab', instance: this });

        this.el = document.querySelector(element);

        this.options = Axentix.getComponentOptions('Fab', options, this.el, isLoadedWithData);

        this._setup();
      } catch (error) {
        console.error('[Axentix] Fab init error', error);
      }
    }

    /**
     * Setup component
     */
    _setup() {
      Axentix.createEvent(this.el, 'fab.setup');

      this.isAnimated = false;
      this.isActive = false;
      this.trigger = document.querySelector('#' + this.el.id + ' .fab-trigger');
      this.fabMenu = document.querySelector('#' + this.el.id + ' .fab-menu');

      this._verifOptions();
      this._setupListeners();
      this.el.style.transitionDuration = this.options.animationDuration + 'ms';
      this._setProperties();
    }

    /**
     * Options check
     */
    _verifOptions() {
      const directionList = ['right', 'left', 'top', 'bottom'];
      directionList.includes(this.options.direction) ? '' : (this.options.direction = 'top');

      const positionList = ['top-right', 'top-left', 'bottom-right', 'bottom-left'];
      positionList.includes(this.options.position) ? '' : (this.options.position = 'bottom-right');
    }

    /**
     * Setup listeners
     */
    _setupListeners() {
      if (this.options.hover) {
        this.openRef = this.open.bind(this);
        this.closeRef = this.close.bind(this);
        this.el.addEventListener('mouseenter', this.openRef);
        this.el.addEventListener('mouseleave', this.closeRef);
      } else {
        this.listenerRef = this._onClickTrigger.bind(this);
        this.el.addEventListener('click', this.listenerRef);
      }

      this.documentClickRef = this._handleDocumentClick.bind(this);
      document.addEventListener('click', this.documentClickRef, true);
    }

    /**
     * Remove listeners
     */
    _removeListeners() {
      if (this.options.hover) {
        this.el.removeEventListener('mouseenter', this.openRef);
        this.el.removeEventListener('mouseleave', this.closeRef);
        this.openRef = undefined;
        this.closeRef = undefined;
      } else {
        this.el.removeEventListener('click', this.listenerRef);
        this.listenerRef = undefined;
      }

      document.removeEventListener('click', this.documentClickRef, true);
      this.documentClickRef = undefined;
    }

    /**
     * Set different options on element
     */
    _setProperties() {
      this.options.position.split('-')[0] === 'top'
        ? (this.el.style.top = this.options.offsetY)
        : (this.el.style.bottom = this.options.offsetY);

      this.options.position.split('-')[1] === 'right'
        ? (this.el.style.right = this.options.offsetX)
        : (this.el.style.left = this.options.offsetX);

      this.options.direction === 'top' || this.options.direction === 'bottom'
        ? ''
        : this.el.classList.add('fab-dir-x');

      this._setMenuPosition();
    }

    /**
     * Set menu position
     */
    _setMenuPosition() {
      if (this.options.direction === 'top' || this.options.direction === 'bottom') {
        const height = this.trigger.clientHeight;
        this.options.direction === 'top'
          ? (this.fabMenu.style.bottom = height + 'px')
          : (this.fabMenu.style.top = height + 'px');
      } else {
        const width = this.trigger.clientWidth;
        this.options.direction === 'right'
          ? (this.fabMenu.style.left = width + 'px')
          : (this.fabMenu.style.right = width + 'px');
      }
    }

    /**
     * Handle document click event
     * @param {Event} e
     */
    _handleDocumentClick(e) {
      const isInside = this.el.contains(e.target);

      !isInside && this.isActive ? this.close() : '';
    }

    /**
     * Handle click on trigger
     * @param {Event} e
     */
    _onClickTrigger(e) {
      e.preventDefault();
      if (this.isAnimated) {
        return;
      }

      this.isActive ? this.close() : this.open();
    }

    /**
     * Open fab
     */
    open() {
      if (this.isActive) {
        return;
      }
      Axentix.createEvent(this.el, 'fab.open');
      this.isAnimated = true;
      this.isActive = true;
      this.el.classList.add('active');
      setTimeout(() => {
        this.isAnimated = false;
      }, this.options.animationDuration);
    }

    /**
     * Close fab
     */
    close() {
      if (!this.isActive) {
        return;
      }
      Axentix.createEvent(this.el, 'fab.close');
      this.isAnimated = true;
      this.isActive = false;
      this.el.classList.remove('active');
      setTimeout(() => {
        this.isAnimated = false;
      }, this.options.animationDuration);
    }
  }

  Axentix.Config.registerComponent({
    class: Fab,
    name: 'Fab',
    dataDetection: true,
    autoInit: {
      enabled: true,
      selector: '.fab:not(i):not(.no-axentix-init)',
    },
  });
})();
