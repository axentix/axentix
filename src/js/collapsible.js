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
      animationDelay: 400
    };

    this.el = document.querySelector(element);
    this.el.Collapsible = this;
    this.collapsibleTriggers = document.querySelectorAll('.collapsible-trigger');
    this.isActive = this.el.classList.contains('active') ? true : false;

    /**
     * Options
     * @member Collapsible#options
     * @property {integer} animationDelay Delay to collapse content in ms
     */
    this.options = extend(this.defaultOptions, options);
    console.log(this.options);
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
   * Handle click on trigger
   */
  _onClickTrigger(e, id) {
    e.preventDefault();
    const collapsible = document.querySelector('#' + id).Collapsible;

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
    this.el.style.display = 'block';
    this.el.classList.add('active');
    this.el.style.maxHeight = this.el.scrollHeight + 'px';
  }

  /**
   * Close collapsible
   */
  close() {
    this.el.style.maxHeight = '';
    this.el.classList.remove('active');
    setTimeout(() => {
      this.el.style.display = '';
    }, this.options.animationDelay);
  }
}
