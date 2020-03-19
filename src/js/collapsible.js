/**
 * Class Collapsible
 * @class
 */
class Collapsible extends AxentixComponent {
  /**
   * Construct Collapsible instance
   * @constructor
   * @param {String} element
   * @param {Object} options
   */
  constructor(element, options) {
    super();
    this.defaultOptions = {
      animationDelay: 300,
      sidenav: {
        activeClass: true,
        activeWhenOpen: true,
        autoCloseOtherCollapsible: true
      }
    };

    this.el = document.querySelector(element);

    this.options = Axentix.extend(this.defaultOptions, options);
    this._setup();
  }

  /**
   * Setup component
   */
  _setup() {
    Axentix.createEvent(this.el, 'collapsible.setup');
    this.el.Collapsible = this;
    this.collapsibleTriggers = document.querySelectorAll('.collapsible-trigger');
    this.isInitialStart = true;
    this.isActive = this.el.classList.contains('active') ? true : false;
    this.isAnimated = false;
    this.isInSidenav = false;
    this.childIsActive = false;

    this._setupListeners();
    this.el.style.transitionDuration = this.options.animationDelay + 'ms';

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
    this.collapsibleTriggers.forEach(trigger => {
      if (trigger.dataset.target === this.el.id) {
        trigger.addEventListener('click', this.listenerRef);
      }
    });
  }

  /**
   * Remove listeners
   */
  _removeListeners() {
    this.collapsibleTriggers.forEach(trigger => {
      if (trigger.dataset.target === this.el.id) {
        trigger.removeEventListener('click', this.listenerRef);
      }
    });
    this.listenerRef = undefined;
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

    this.sidenavCollapsibles = document.querySelectorAll('#' + this.sidenavId + ' .collapsible');
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
      triggers.forEach(trigger => {
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
    triggers.forEach(trigger => {
      if (trigger.dataset.target === this.el.id) {
        state ? trigger.classList.add('active') : trigger.classList.remove('active');
      }
    });
  }

  /**
   * Auto close others collapsible
   */
  _autoCloseOtherCollapsible() {
    if (!this.isInitialStart && this.isInSidenav) {
      this.sidenavCollapsibles.forEach(collapsible => {
        if (collapsible.id !== this.el.id) {
          collapsible.Collapsible.close();
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
    }, this.options.animationDelay);
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
    if (this.isActive) {
      return;
    }
    Axentix.createEvent(this.el, 'collapsible.open');
    this.isActive = true;
    this.isAnimated = true;
    this.el.style.display = 'block';
    this._applyOverflow();
    this.el.style.maxHeight = this.el.scrollHeight + 'px';

    this.options.sidenav.activeWhenOpen ? this._addActiveToTrigger(true) : '';
    this.options.sidenav.autoCloseOtherCollapsible ? this._autoCloseOtherCollapsible() : '';

    setTimeout(() => {
      this.isAnimated = false;
    }, this.options.animationDelay);
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
    }, this.options.animationDelay);
  }
}
Axentix.Collapsible = Collapsible;
