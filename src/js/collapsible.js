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
      animationDelay: 300
    };

    this.el = document.querySelector(element);
    this.el.Collapsible = this;
    this.collapsibleTriggers = document.querySelectorAll('.collapsible-trigger');
    this.isActive = this.el.classList.contains('active') ? true : false;
    this.isAnimated = false;

    /**
     * Options
     * @member Collapsible#options
     * @property {integer} animationDelay Delay to collapse content in ms
     */
    this.options = extend(this.defaultOptions, options);
    this._setup();
    this.isActive ? this.open() : '';
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
    collapsible.isActive = !collapsible.isActive;
  }

  /**
   * Open collapsible
   */
  open() {
    this.isAnimated = true;
    this.el.style.display = 'block';
    this._applyOverflow();
    this.el.style.maxHeight = this.el.scrollHeight + 'px';
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
    setTimeout(() => {
      this.el.style.display = '';
      this.isAnimated = false;
    }, this.options.animationDelay);
  }
}
