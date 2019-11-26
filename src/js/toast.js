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
      animationDelay: 400,
      displayTime: 4000,
      classes: 'toast shadow-1',
      yAxis: 'top',
      xAxis: 'right'
    };

    this.options = extend(this.defaultOptions, options);
  }

  /**
   * Create toast container
   */
  createToaster() {
    //  need to use xAxis and yAxis
    let toaster = document.createElement('div');
    if (this.options.xAxis === 'right') {
      toaster.setAttribute('class', 'toaster toaster-right');
    } else if (this.options.xAxis === 'left') {
      toaster.setAttribute('class', 'toaster toaster-left');
    }
    document.body.appendChild(toaster);
  }

  removeToaster() {
    if (document.querySelector('.toaster').childElementCount <= 0) {
      document.querySelector('.toaster').remove();
    }
  }

  /**
   * Toast in animation
   */
  animToastIn(toast) {
    toast.style.opacity = 0.2;
    toast.style.marginTop = 5 + 'rem';
    setTimeout(() => {
      toast.style.marginTop = 1 + 'rem';
      toast.style.opacity = 1;
    }, 50);
  }

  /**
   * Toast out animation
   */
  animToastOut(toast) {
    setTimeout(() => {
      toast.style.opacity = 0;
    }, this.options.displayTime);
  }

  /**
   * Toast remove
   */
  removeToast(toast) {
    setTimeout(() => {
      toast.style.paddingTop = 0;
      toast.style.paddingBottom = 0;
      toast.style.marginTop = 0;
    }, this.options.displayTime + this.options.animationDelay);

    setTimeout(() => {
      toast.remove();
    }, this.options.displayTime + 2 * this.options.animationDelay);
  }

  /**
   * Create toast
   */
  createToast() {
    let toast = document.createElement('div');

    toast.className = this.options.classes;
    toast.style.transitionDuration = this.options.animationDelay + 'ms';

    // anim toast in
    this.animToastIn(toast);

    document.querySelector('.toaster').appendChild(toast);

    this.animToastOut(toast);

    this.removeToast(toast);

    setTimeout(() => {
      this.removeToaster();
    }, this.options.displayTime + 2 * this.options.animationDelay + 500);
  }

  /**
   * Showing the toast
   */
  show() {
    if (!document.querySelector('.toaster')) {
      this.createToaster(this.options);
    }

    // let toaster = document.querySelector('id', 'toaster');

    this.createToast();
  }
}
