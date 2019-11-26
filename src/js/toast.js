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
      position: 'bottom-left'
    };

    this.content = content;
    this.options = extend(this.defaultOptions, options);
  }

  /**
   * Create toast container
   */

  createToaster() {
    //  need to use xAxis and yAxis
    let toaster = document.createElement('div');
    let position = this.options.position.split('-');

    // if (position[0] === 'top' && position[1] === 'right') {
    //   toaster.setAttribute('class', 'toaster toaster-right');
    // } else if (position[0] === 'top' && position[1] === 'left') {
    //   toaster.setAttribute('class', 'toaster toaster-left');
    // } else if (position[0] === 'bottom' && position[1] === 'right') {
    //   toaster.setAttribute('class', 'toaster toaster-right toast-bottom');
    // } else if (position[0] === 'bottom' && position[1] === 'left') {
    //   toaster.setAttribute('class', 'toaster toaster-left toast-bottom');
    // }
    toaster.setAttribute('class', 'toaster toaster-' + position[1] + ' toast-' + position[0]);

    document.body.appendChild(toaster);
  }

  removeToaster() {
    document.querySelector('.toaster').remove();
  }

  /**
   * Toast in animation
   */
  fadeInToast(toast) {
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
  fadeOutToast(toast) {
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
      toast.style.height = '0px';
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
    toast.innerHTML = this.content;
    toast.style.transitionDuration = this.options.animationDelay + 'ms';

    // anim toast in
    this.fadeInToast(toast);

    document.querySelector('.toaster').appendChild(toast);

    this.fadeOutToast(toast);

    this.removeToast(toast);

    // remove toaster if there is no more toasts on the page
    setTimeout(() => {
      if (document.querySelector('.toaster').childElementCount <= 0) {
        this.removeToaster();
      }
    }, this.options.displayTime + 2 * this.options.animationDelay + 500);
  }

  /**
   * Showing the toast
   */
  show() {
    if (!document.querySelector('.toaster')) {
      this.createToaster(this.options);
    }

    this.createToast();
  }
}
