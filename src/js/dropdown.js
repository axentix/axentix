/**
 * Class Dropdown
 * @class
 */
class Dropdown {
  /**
   * Construct Dropdown instance
   * @constructor
   * @param {String} element
   * @param {Object} options
   */
  constructor(element, options) {
    this.defaultOptions = {
      animationDelay: 300,
      animationType: 'none',
      hover: false
    };

    this.el = document.querySelector(element);
    this.el.Dropdown = this;
    this.isAnimated = false;
    this.isActive = this.el.classList.contains('active') ? true : false;

    this.options = extend(this.defaultOptions, options);
    this._setup();
  }

  /**
   * Setup listeners
   */
  _setup() {
    document
      .querySelector('#' + this.el.id + ' .dropdown-trigger')
      .addEventListener('click', e => this._onClickTrigger(e, this.el.id));

    document.addEventListener('click', e => this._onDocumentClick(e, this.el.id), true);
  }

  _setAnimation() {}

  /**
   * Handle click on document click
   * @param {Event} e
   * @param {String} id
   */
  _onDocumentClick(e, id) {
    e.preventDefault();
    if (e.target.matches('.dropdown-trigger')) {
      return;
    }
    const element = document.querySelector('#' + id);
    const dropdown = element.Dropdown;

    if (dropdown.isAnimated || !dropdown.isActive) {
      return;
    }

    dropdown.close();
  }

  /**
   * Handle click on trigger
   * @param {Event} e
   * @param {String} id
   */
  _onClickTrigger(e, id) {
    e.preventDefault();
    const element = document.querySelector('#' + id);
    const dropdown = element.Dropdown;

    if (dropdown.isAnimated) {
      return;
    }

    if (dropdown.isActive) {
      dropdown.close();
    } else {
      dropdown.open();
    }
  }

  /**
   * Open dropdown
   */
  open() {
    if (this.isActive) {
      return;
    }
    this.el.classList.add('active');
    this.isActive = true;

    if (this.options.animationType !== 'none') {
      this.isAnimated = true;
      setTimeout(() => {
        this.isAnimated = false;
      }, this.options.animationDelay);
    }
  }

  /**
   * Close dropdown
   */
  close() {
    if (!this.isActive) {
      return;
    }
    this.el.classList.remove('active');

    if (this.options.animationType !== 'none') {
      this.isAnimated = true;
      setTimeout(() => {
        this.isAnimated = false;
        this.isActive = false;
      }, this.options.animationDelay);
    } else {
      this.isAnimated = false;
      this.isActive = false;
    }
  }
}
