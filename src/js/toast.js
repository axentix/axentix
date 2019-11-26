/**
 * Class toast
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
      animationDelay: 4000,
      displayTime: 4000,
      classes: 'toast shadow-1',
      position: 'right',
      comeFrom: 'top'
    };

    this.content = content;
    this.options = extend(this.defaultOptions, options);
  }

  /**
   * Create toast container
   */

  _createToaster() {
    //  need to use xAxis and yAxis
    let toaster = document.createElement('div');

    const positionList = ['right', 'left'];
    positionList.includes(this.options.position) ? '' : (this.options.position = 'right');

    const comeFromList = ['bottom', 'top'];
    comeFromList.includes(this.options.comeFrom) ? '' : (this.options.comeFrom = 'top');

    toaster.setAttribute(
      'class',
      'toaster toaster-' + this.options.position + ' toast-' + this.options.comeFrom
    );

    document.body.appendChild(toaster);
  }

  _removeToaster() {
    document.querySelector('.toaster').remove();
  }

  /**
   * Toast in animation
   */
  _fadeInToast(toast) {
    toast.style.opacity = 0.2;

    if (this.options.comeFrom === 'top') {
      toast.style.marginTop = 5 + 'rem';
      setTimeout(() => {
        toast.style.marginTop = 1 + 'rem';
        toast.style.opacity = 1;
      }, 50);
    } else if (this.options.comeFrom === 'bottom') {
      toast.style.marginBottom = 5 + 'rem';
      setTimeout(() => {
        toast.style.marginBottom = 1 + 'rem';
        toast.style.opacity = 1;
      }, 50);
    }
  }

  /**
   * Toast out animation
   */
  _fadeOutToast(toast) {
    setTimeout(() => {
      toast.style.opacity = 0;
    }, this.options.displayTime);
  }

  /**
   * Toast remove
   */
  _removeToast(toast) {
    setTimeout(() => {
      toast.style.paddingTop = 0;
      toast.style.paddingBottom = 0;
      toast.style.height = '0px';
      // if (this.options.comeFrom === 'top') {
      //   toast.style.marginTop = 0;
      // } else if (this.options.comeFrom === 'bottom') {
      //   toast.style.marginBottom = 0;
      // }
      toast.style.marginBottom = 0;
    }, this.options.displayTime + this.options.animationDelay);

    setTimeout(() => {
      toast.remove();
    }, this.options.displayTime + 2 * this.options.animationDelay);
  }

  /**
   * Create toast
   */
  _createToast() {
    let toast = document.createElement('div');

    toast.className = this.options.classes;
    toast.innerHTML = this.content;
    toast.style.transitionDuration = this.options.animationDelay + 'ms';

    // anim toast in
    this._fadeInToast(toast);

    document.querySelector('.toaster').appendChild(toast);

    this._fadeOutToast(toast);

    this._removeToast(toast);

    // remove toaster if there is no more toasts on the page
    setTimeout(() => {
      if (document.querySelector('.toaster').childElementCount <= 0) {
        this._removeToaster();
      }
    }, this.options.displayTime + 2 * this.options.animationDelay + 500);
  }

  /**
   * Showing the toast
   */
  show() {
    if (!document.querySelector('.toaster')) {
      this._createToaster(this.options);
    }

    this._createToast();
  }
}
