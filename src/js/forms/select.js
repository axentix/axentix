/**
 * Class Select
 * @class
 */
class Select {
  /**
   * Construct Select instance
   * @constructor
   * @param {String} element
   * @param {Object} options
   */
  constructor(element, options) {
    this.defaultOptions = {};

    this.el = document.querySelector(element);

    /**
     * Options
     * @member Select#options
     */
    this.options = extend(this.defaultOptions, options);
  }
}
