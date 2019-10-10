/**
 * Component: Ghost-Loading
 * Class GhostLoader
 * @class
 */
class GhostLoader {
  /**
   * Construct GhostLoader instance
   * @constructor
   * @param {String} element
   * @param {Object} options
   */
  constructor(element, options) {
    this.el = document.querySelector(element);
    this._getData();
    this._createOverlay();

    /**
     * Options
     * @member GhostLoader#options
     * @property {boolean} fullElement
     * @property {number} nbBar
     * @property {String} backgroundColor
     * @property {String} customClass
     */
    // this.options = options;
  }

  /**
   * Get dimension of element
   */
  _getData() {
    this.width = this.el.clientWidth;
    this.height = this.el.clientHeight;
  }

  /**
   * Create ghost overlay
   */
  _createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.classList.add('ghost-overlay');
    this.overlay.style.width = this.width + 'px';
    this.overlay.style.height = this.height + 'px';
  }

  /**
   * Enable / Disable loader
   * @param {boolean} state
   */
  load(state) {
    if (!state) {
      this.el.removeChild(this.overlay);
    } else {
      this.el.appendChild(this.overlay);
    }
  }
}
