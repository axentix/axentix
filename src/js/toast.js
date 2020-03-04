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
      duration: 4000,
      classes: '',
      position: 'right',
      direction: 'top',
      mobileDirection: 'bottom',
      isClosable: false
    };

    if (Axentix.toastInstanceExist) {
      console.error("Don't try to create multiple toast instances");
      return;
    } else {
      Axentix.toastInstanceExist = true;
    }

    this.content = content;
    this.options = Axentix.extend(this.defaultOptions, options);
    this.options.position = this.options.position.toLowerCase();
    this.options.direction = this.options.direction.toLowerCase();
    this.options.mobileDirection = this.options.mobileDirection.toLowerCase();
    this.toasters = {};
  }

  /**
   * Create toast container
   */
  _createToaster() {
    let toaster = document.createElement('div');

    const positionList = ['right', 'left'];
    positionList.includes(this.options.position) ? '' : (this.options.position = 'right');

    const directionList = ['bottom', 'top'];
    directionList.includes(this.options.direction) ? '' : (this.options.direction = 'top');

    directionList.includes(this.options.mobileDirection) ? '' : (this.options.mobileDirection = 'bottom');

    toaster.className =
      'toaster toaster-' +
      this.options.position +
      ' toast-' +
      this.options.direction +
      ' toaster-mobile-' +
      this.options.mobileDirection;

    this.toasters[this.options.position] = toaster;
    document.body.appendChild(toaster);
  }

  /**
   * Remove toast container
   */
  _removeToaster() {
    for (const key in this.toasters) {
      let toaster = this.toasters[key];
      if (toaster.childElementCount <= 0) {
        toaster.remove();
        delete this.toasters[key];
      }
    }
  }

  /**
   * Toast in animation
   * @param {Element} toast
   */
  _fadeInToast(toast) {
    setTimeout(() => {
      Axentix.createEvent(toast, 'toast.show');
      toast.classList.add('toast-animated');

      setTimeout(() => {
        Axentix.createEvent(toast, 'toast.shown');
      }, this.options.animationDelay);
    }, 50);
  }

  /**
   * Toast out animation
   * @param {Element} toast
   */
  _fadeOutToast(toast) {
    setTimeout(() => {
      Axentix.createEvent(toast, 'toast.hide');
      this._hide(toast);
    }, this.options.duration + this.options.animationDelay);
  }

  /**
   * Anim out toast
   * @param {Element} toast
   */
  _animOut(toast) {
    toast.style.transitionTimingFunction = 'cubic-bezier(0.445, 0.05, 0.55, 0.95)';
    toast.style.paddingTop = 0;
    toast.style.paddingBottom = 0;
    toast.style.margin = 0;
    toast.style.height = 0;
  }

  /**
   * Create toast
   */
  _createToast() {
    let toast = document.createElement('div');

    toast.className = 'toast shadow-1 ' + this.options.classes;
    toast.innerHTML = this.content;
    toast.style.transitionDuration = this.options.animationDelay + 'ms';

    if (this.options.isClosable) {
      let trigger = document.createElement('i');
      trigger.className = 'toast-trigger fas fa-times';
      trigger.listenerRef = this._hide.bind(this, toast, trigger);
      trigger.addEventListener('click', trigger.listenerRef);
      toast.appendChild(trigger);
    }

    this._fadeInToast(toast);

    this.toasters[this.options.position].appendChild(toast);

    this._fadeOutToast(toast);

    const height = toast.clientHeight;
    toast.style.height = height + 'px';
  }

  /**
   * Hide toast
   * @param {String} toast
   * @param {Element} trigger
   * @param {Event} e
   */
  _hide(toast, trigger, e) {
    if (toast.isAnimated) {
      return;
    }

    let timer = 1;
    if (e) {
      e.preventDefault();
      timer = 0;
      this.options.isClosable ? trigger.removeEventListener('click', trigger.listenerRef) : '';
    }

    toast.style.opacity = 0;
    toast.isAnimated = true;
    const delay = timer * this.options.animationDelay + this.options.animationDelay;
    setTimeout(() => {
      this._animOut(toast);
    }, delay / 2);
    setTimeout(() => {
      toast.remove();
      Axentix.createEvent(toast, 'toast.remove');
      this._removeToaster();
    }, delay * 1.45);
  }

  /**
   * Showing the toast
   */
  show() {
    if (!Object.keys(this.toasters).includes(this.options.position)) {
      this._createToaster();
    }
    this._createToast();
  }

  /**
   * Change
   * @param {String} content
   * @param {Object} options
   */
  change(content, options) {
    this.content = content;
    this.options = Axentix.extend(this.options, options);
  }
}
