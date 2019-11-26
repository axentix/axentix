/**
 * Class Ghostix
 * @class
 */
class Ghostix {
  /**
   * Construct Ghostix instance
   * @constructor
   * @param {String} element
   * @param {Object} options
   */
  constructor(element, options) {
    this.defaultOptions = {
      type: 'container',
      backgroundColor: '#b8b8b8',
      animationClass: 'ghostix',
      width: '',
      height: '',
      // For bar
      nbBar: 3
    };

    this.el = document.querySelector(element);
    this.width = this.el.clientWidth + 'px';
    this.height = this.el.clientHeight + 'px';

    this.options = extend(this.defaultOptions, options);

    this._setup();
  }

  _setup() {
    this._verifType();
    this['_' + this.options.type + 'Type']();

    this._createContainer();
  }

  _verifType() {
    const typeList = ['container', 'bar', 'circle'];
    typeList.includes(this.options.type) ? '' : (this.options.type = 'container');
  }

  /**
   * Create ghost container
   */
  _createContainer() {
    this.container = document.createElement('div');
    this.container.classList.add('ghostix-container');
    this.container.style.backgroundColor = this.options.backgroundColor;
  }

  _containerType() {
    if (this.options.width || this.options.height) {
      width = this.options.width;
      height = this.options.height;
    }
  }

  /**
   * Enable / Disable loader
   * @param {boolean} state
   */
  load(state) {
    if (!state) {
      this.el.removeChild(this.container);
    } else {
      this.el.appendChild(this.container);
    }
  }
}
