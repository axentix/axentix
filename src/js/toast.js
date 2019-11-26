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
      animationDelay: 1000,
      classes: ['toast', 'shadow-1'],
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
    if (this.options.xAxis == 'right') {
      toaster.setAttribute('class', 'toaster toaster-right');
    } else if (this.options.xAxis == 'left') {
      toaster.setAttribute('class', 'toaster toaster-left');
    }
    document.body.appendChild(toaster);
  }

  /**
   * Create toast
   */
  createToast() {
    var toast = document.createElement('div');

    this.options.classes.forEach(element => {
      toast.classList.add(element);
    });
    toast.style.transitionDuration = this.options.animationDelay + 'ms';

    // anim toast in

    setTimeout(() => {
      toast.style.marginTop = 1 + 'rem';
    }, 5);
    toast.style.marginTop = 2 + 'rem';

    document.querySelector('.toaster').appendChild(toast);

    // anim toast out
    setTimeout(() => {
      toast.style.opacity = 0;
    }, 1000);
  }

  /**
   * Showing the toast
   */
  show() {
    if (!document.querySelector('id', 'toaster')) {
      this.createToaster(this.options);
    }

    let toaster = document.querySelector('id', 'toaster');

    this.createToast();
  }
}
