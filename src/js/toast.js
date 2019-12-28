/**
 * Class Toast
 * @class
 */
class Toast {
  /**
   * Construct Toast instance
   * @constructor
   * @param {String} content
   * @param {Object} options
   */

  constructor(content, options) {
    this.defaultOptions = {
      animationDelay: 400,
      displayTime: 4000,
      classes: '',
      position: 'right',
      comeFrom: 'top',
      mobileComeFrom: 'bottom'
    };

    if (Axentix.toastInstanceExist) {
      console.error("Don't try to create multiple toast instances");
      return;
    } else {
      Axentix.toastInstanceExist = true;
    }

    this.content = content;
    this.options = Axentix.extend(this.defaultOptions, options);
  }

  /**
   * Create toast container
   */

  _createToaster() {
    this.toaster = document.createElement('div');

    const positionList = ['right', 'left'];
    positionList.includes(this.options.position) ? '' : (this.options.position = 'right');

    const comeFromList = ['bottom', 'top'];
    comeFromList.includes(this.options.comeFrom) ? '' : (this.options.comeFrom = 'top');

    comeFromList.includes(this.options.mobileComeFrom) ? '' : (this.options.mobileComeFrom = 'bottom');

    this.toaster.className =
      'toaster toaster-' +
      this.options.position +
      ' toast-' +
      this.options.comeFrom +
      ' toaster-mobile-' +
      this.options.mobileComeFrom;

    document.body.appendChild(this.toaster);
  }

  _removeToaster() {
    setTimeout(() => {
      if (this.toaster.childElementCount <= 0) {
        this.toaster.remove();
        this.toaster = undefined;
      }
    }, 50);
  }

  /**
   * Toast in animation
   * @param {Element} toast
   */
  _fadeInToast(toast) {
    setTimeout(() => {
      toast.classList.add('toast-animated');
    }, 50);
  }

  /**
   * Toast out animation
   * @param {Element} toast
   */
  _fadeOutToast(toast) {
    setTimeout(() => {
      toast.style.opacity = 0;
    }, this.options.displayTime + this.options.animationDelay);
  }

  /**
   * Remove toast
   * @param {Element} toast
   */
  _removeToast(toast) {
    const height = toast.clientHeight;
    toast.style.height = height + 'px';

    setTimeout(() => {
      toast.style.transitionTimingFunction = 'cubic-bezier(0.445, 0.05, 0.55, 0.95)';
      toast.style.paddingTop = 0;
      toast.style.paddingBottom = 0;
      toast.style.margin = 0;
      toast.style.height = 0;
    }, this.options.displayTime + 2 * this.options.animationDelay);

    setTimeout(() => {
      toast.remove();
      this._removeToaster();
    }, this.options.displayTime + 3 * this.options.animationDelay);
  }

  /**
   * Create toast
   */
  _createToast() {
    let toast = document.createElement('div');

    toast.className = 'toast shadow-1 ' + this.options.classes;
    toast.innerHTML = this.content;
    toast.style.transitionDuration = this.options.animationDelay + 'ms';

    this._fadeInToast(toast);

    this.toaster.appendChild(toast);

    this._fadeOutToast(toast);

    this._removeToast(toast);
  }

  /**
   * Showing the toast
   */
  show() {
    this.toaster ? '' : this._createToaster(this.options);
    this._createToast();
  }

  /**
   * Change toast html
   *@param {String} newContent
   */
  changeContent(newContent) {
    this.content = newContent;
  }

  /**
   * Change toast classes
   *@param {String} newContent
   */
  changeClasses(newClasses) {
    this.options.classes = newClasses;
  }
}
