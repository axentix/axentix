(() => {
  /**
   * Class Modal
   * @class
   */
  class Modal extends AxentixComponent {
    static getDefaultOptions() {
      return {
        overlay: true,
        bodyScrolling: false,
        animationDuration: 400,
      };
    }

    /**
     * Construct Modal instance
     * @constructor
     * @param {String} element
     * @param {Object} options
     */
    constructor(element, options, isLoadedWithData) {
      super();

      try {
        this.preventDbInstance(element);
        Axentix.instances.push({ type: 'Modal', instance: this });

        this.el = document.querySelector(element);

        this.options = Axentix.getComponentOptions('Modal', options, this.el, isLoadedWithData);

        this._setup();
      } catch (error) {
        console.error('[Axentix] Modal init error', error);
      }
    }

    /**
     * Setup component
     */
    _setup() {
      Axentix.createEvent(this.el, 'modal.setup');
      this.modalTriggers = document.querySelectorAll('.modal-trigger');
      this.isActive = this.el.classList.contains('active') ? true : false;
      this.isAnimated = false;

      this._setupListeners();
      this.options.overlay ? this._createOverlay() : '';
      this.el.style.transitionDuration = this.options.animationDuration + 'ms';
      this.el.style.animationDuration = this.options.animationDuration + 'ms';
    }

    /**
     * Setup listeners
     */
    _setupListeners() {
      this.listenerRef = this._onClickTrigger.bind(this);
      this.modalTriggers.forEach((trigger) => {
        if (trigger.dataset.target === this.el.id) {
          trigger.addEventListener('click', this.listenerRef);
        }
      });
    }

    /**
     * Remove listeners
     */
    _removeListeners() {
      this.modalTriggers.forEach((trigger) => {
        if (trigger.dataset.target === this.el.id) {
          trigger.removeEventListener('click', this.listenerRef);
        }
      });
      this.listenerRef = undefined;
    }

    /**
     * Create overlay element
     */
    _createOverlay() {
      if (this.isActive && this.options.overlay) {
        this.overlayElement = document.querySelector('.modal-overlay[data-target="' + this.el.id + '"]');
        this.overlayElement ? '' : (this.overlayElement = document.createElement('div'));
      } else {
        this.overlayElement = document.createElement('div');
      }
      this.overlayElement.classList.add('modal-overlay');
      this.overlayElement.style.transitionDuration = this.options.animationDuration + 'ms';
      this.overlayElement.dataset.target = this.el.id;
    }

    /**
     * Enable or disable body scroll when option is true
     * @param {boolean} state Enable or disable body scroll
     */
    _toggleBodyScroll(state) {
      if (!this.options.bodyScrolling) {
        state ? (document.body.style.overflow = '') : (document.body.style.overflow = 'hidden');
      }
    }

    /**
     * Set Z-Index when modal is open
     */
    _setZIndex() {
      const totalModals = document.querySelectorAll('.modal.active').length + 1;

      this.options.overlay ? (this.overlayElement.style.zIndex = 800 + totalModals * 6) : '';
      this.el.style.zIndex = 800 + totalModals * 10;
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

    /**
     * Open the modal
     */
    open() {
      if (this.isActive) {
        return;
      }
      Axentix.createEvent(this.el, 'modal.open');
      this.isActive = true;
      this.isAnimated = true;
      this._setZIndex();
      this.el.style.display = 'block';
      this.overlay(true);
      this._toggleBodyScroll(false);
      setTimeout(() => {
        this.el.classList.add('active');
      }, 50);

      setTimeout(() => {
        this.isAnimated = false;
        Axentix.createEvent(this.el, 'modal.opened');
      }, this.options.animationDuration);
    }

    /**
     * Close the modal
     */
    close() {
      if (!this.isActive) {
        return;
      }
      Axentix.createEvent(this.el, 'modal.close');
      this.isAnimated = true;
      this.el.classList.remove('active');
      this.overlay(false);
      setTimeout(() => {
        this.el.style.display = '';
        this.isAnimated = false;
        this.isActive = false;
        this._toggleBodyScroll(true);
        Axentix.createEvent(this.el, 'modal.closed');
      }, this.options.animationDuration);
    }

    /**
     * Manage overlay
     * @param {boolean} state
     */
    overlay(state) {
      if (this.options.overlay) {
        if (state) {
          this.overlayElement.addEventListener('click', this.listenerRef);
          document.body.appendChild(this.overlayElement);
          setTimeout(() => {
            this.overlayElement.classList.add('active');
          }, 50);
        } else {
          this.overlayElement.classList.remove('active');
          setTimeout(() => {
            this.overlayElement.removeEventListener('click', this.listenerRef);
            document.body.removeChild(this.overlayElement);
          }, this.options.animationDuration);
        }
      }
    }
  }

  Axentix.Config.registerComponent({
    class: Modal,
    name: 'Modal',
    dataDetection: true,
    autoInit: {
      enabled: true,
      selector: '.modal:not(.no-axentix-init)',
    },
  });
})();
