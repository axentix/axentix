(() => {
  /**
   * Class Collapsible
   * @class
   */
  class Collapsible extends AxentixComponent {
    static getDefaultOptions() {
      return {
        animationDuration: 300,
        sidenav: {
          activeClass: true,
          activeWhenOpen: true,
          autoClose: true,
        },
      };
    }

    /**
     * Construct Collapsible instance
     * @constructor
     * @param {String} element
     * @param {Object} options
     */
    constructor(element, options, isLoadedWithData) {
      super();

      try {
        this.preventDbInstance(element);
        Axentix.instances.push({ type: 'Collapsible', instance: this });

        this.el = document.querySelector(element);

        this.options = Axentix.getComponentOptions('Collapsible', options, this.el, isLoadedWithData);

        this._setup();
      } catch (error) {
        console.error('[Axentix] Collapsible init error', error);
      }
    }

    /**
     * Setup component
     */
    _setup() {
      Axentix.createEvent(this.el, 'collapsible.setup');

      this.collapsibleTriggers = document.querySelectorAll('.collapsible-trigger');
      this.isInitialStart = true;
      this.isActive = this.el.classList.contains('active') ? true : false;
      this.isAnimated = false;
      this.isInSidenav = false;
      this.childIsActive = false;

      this._setupListeners();
      this.el.style.transitionDuration = this.options.animationDuration + 'ms';

      this._detectSidenav();
      this._detectChild();
      this.options.sidenav.activeClass ? this._addActiveInSidenav() : '';

      this.isActive ? this.open() : '';
      this.isInitialStart = false;
    }

    /**
     * Setup listeners
     */
    _setupListeners() {
      this.listenerRef = this._onClickTrigger.bind(this);
      this.collapsibleTriggers.forEach((trigger) => {
        if (trigger.dataset.target === this.el.id) {
          trigger.addEventListener('click', this.listenerRef);
        }
      });

      this.resizeRef = this._handleResize.bind(this);
      window.addEventListener('resize', this.resizeRef);
    }

    /**
     * Remove listeners
     */
    _removeListeners() {
      this.collapsibleTriggers.forEach((trigger) => {
        if (trigger.dataset.target === this.el.id) {
          trigger.removeEventListener('click', this.listenerRef);
        }
      });
      this.listenerRef = undefined;

      window.removeEventListener('resize', this.resizeRef);
      this.resizeRef = undefined;
    }

    /**
     * Reset collapsible maxHeight
     */
    _handleResize() {
      this.isActive && !this.isInSidenav ? (this.el.style.maxHeight = this.el.scrollHeight + 'px') : '';
    }

    /**
     * Check if collapsible is in sidenav
     */
    _detectSidenav() {
      const sidenavElem = this.el.closest('.sidenav');

      if (sidenavElem) {
        this.isInSidenav = true;
        this.sidenavId = sidenavElem.id;
      }
    }

    /**
     * Check if collapsible have active childs
     */
    _detectChild() {
      for (const child of this.el.children) {
        if (child.classList.contains('active')) {
          this.childIsActive = true;
          break;
        }
      }
    }

    /**
     * Add active class to trigger and collapsible
     */
    _addActiveInSidenav() {
      if (this.childIsActive && this.isInSidenav) {
        const triggers = document.querySelectorAll('.sidenav .collapsible-trigger');
        triggers.forEach((trigger) => {
          if (trigger.dataset.target === this.el.id) {
            trigger.classList.add('active');
          }
        });

        this.el.classList.add('active');
        this.open();
        this.isActive = true;
      }
    }

    /**
     * Enable / disable active state to trigger when collapsible is in sidenav
     * @param {boolean} state enable or disable
     */
    _addActiveToTrigger(state) {
      const triggers = document.querySelectorAll('.sidenav .collapsible-trigger');
      triggers.forEach((trigger) => {
        if (trigger.dataset.target === this.el.id) {
          state ? trigger.classList.add('active') : trigger.classList.remove('active');
        }
      });
    }

    /**
     * Auto close others collapsible
     */
    _autoClose() {
      if (!this.isInitialStart && this.isInSidenav) {
        Axentix.getInstanceByType('Collapsible').map((collapsible) => {
          if (
            collapsible.isInSidenav &&
            collapsible.sidenavId === this.sidenavId &&
            collapsible.el.id !== this.el.id
          ) {
            collapsible.close();
          }
        });
      }
    }

    /**
     * Apply overflow hidden and automatically remove
     */
    _applyOverflow() {
      this.el.style.overflow = 'hidden';
      setTimeout(() => {
        this.el.style.overflow = '';
      }, this.options.animationDuration);
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
     * Open collapsible
     */
    open() {
      if (this.isActive && !this.isInitialStart) {
        return;
      }
      Axentix.createEvent(this.el, 'collapsible.open');
      this.isActive = true;
      this.isAnimated = true;
      this.el.style.display = 'block';
      this._applyOverflow();
      this.el.style.maxHeight = this.el.scrollHeight + 'px';

      this.options.sidenav.activeWhenOpen ? this._addActiveToTrigger(true) : '';
      this.options.sidenav.autoClose ? this._autoClose() : '';

      setTimeout(() => {
        this.isAnimated = false;
      }, this.options.animationDuration);
    }

    /**
     * Close collapsible
     */
    close() {
      if (!this.isActive) {
        return;
      }
      Axentix.createEvent(this.el, 'collapsible.close');
      this.isAnimated = true;
      this.el.style.maxHeight = '';
      this._applyOverflow();

      this.options.sidenav.activeWhenOpen ? this._addActiveToTrigger(false) : '';

      setTimeout(() => {
        this.el.style.display = '';
        this.isAnimated = false;
        this.isActive = false;
      }, this.options.animationDuration);
    }
  }

  Axentix.Config.registerComponent({
    class: Collapsible,
    name: 'Collapsible',
    dataDetection: true,
    autoInit: {
      enabled: true,
      selector: '.collapsible:not(.no-axentix-init)',
    },
  });
})();
