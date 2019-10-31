/**
 * Class Collapsible
 * @class
 */
class Collapsible {
  /**
   * Construct Collapsible instance
   * @constructor
   * @param {String} element
   * @param {Object} options
   */
  constructor(element, options) {
    this.defaultOptions = {
      animationDelay: 300,
      sidenav: {
        activeClass: true,
        activeWhenOpen: true,
        autoCloseOtherCollapsible: true
      }
    };

    this.el = document.querySelector(element);
    this.el.Collapsible = this;
    this.collapsibleTriggers = document.querySelectorAll('.collapsible-trigger');
    this.initialStart = true;
    this.isActive = this.el.classList.contains('active') ? true : false;
    this.isAnimated = false;
    this.isInSidenav = false;
    this.childIsActive = false;

    /**
     * Options
     * @member Collapsible#options
     * @property {integer} animationDelay Delay to collapse content in ms
     * @property {boolean} activeClassSidenav Add automatically .active class in sidenav to trigger and collapsible
     */
    this.options = extend(this.defaultOptions, options);
    this._setup();
  }

  /**
   * Setup listeners
   */
  _setup() {
    this.collapsibleTriggers.forEach(trigger => {
      if (trigger.dataset.target === this.el.id) {
        trigger.addEventListener('click', e => this._onClickTrigger(e, this.el.id));
      }
    });
    this.el.style.transitionDuration = this.options.animationDelay + 'ms';

    this._detectSidenav();
    this._detectChild();
    this.options.sidenav.activeClass ? this._addActiveInSidenav() : '';

    this.isActive ? this.open() : '';
    this.initialStart = false;
  }

  /**
   * Check if collapsible is in sidenav
   */
  _detectSidenav() {
    let elements = [];
    let currElement = this.el;
    elements.push(currElement);
    while (currElement.parentElement) {
      elements.unshift(currElement.parentElement);
      currElement = currElement.parentElement;
      if (currElement.classList.contains('sidenav')) {
        this.isInSidenav = true;
        break;
      }
    }

    this.sidenavCollapsibles = document.querySelectorAll('.sidenav .collapsible');
  }

  /**
   * Check if collapsible have active childs
   */
  _detectChild() {
    const childrens = this.el.children;
    for (const child of childrens) {
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
    if (!this.initialStart) {
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
   */
  _onClickTrigger(e, id) {
    e.preventDefault();
    const element = document.querySelector('#' + id);
    const collapsible = element.Collapsible;

    if (collapsible.isAnimated) {
      return;
    }

    if (collapsible.isActive) {
      collapsible.close();
    } else {
      collapsible.open();
    }
  }

  /**
   * Open collapsible
   */
  open() {
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
