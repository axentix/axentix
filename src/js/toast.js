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
      animationDelay: 3000,
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
  }

  /**
   * Create toast container
   */

  _createToaster() {
    this.toaster = document.createElement('div');

    const positionList = ['right', 'left'];
    positionList.includes(this.options.position) ? '' : (this.options.position = 'right');

    const directionList = ['bottom', 'top'];
    directionList.includes(this.options.direction) ? '' : (this.options.direction = 'top');

    directionList.includes(this.options.mobileDirection) ? '' : (this.options.mobileDirection = 'bottom');

    this.toaster.className =
      'toaster toaster-' +
      this.options.position +
      ' toast-' +
      this.options.direction +
      ' toaster-mobile-' +
      this.options.mobileDirection;

    document.body.appendChild(this.toaster);
  }

  _removeToaster() {
    setTimeout(() => {
      if (this.toaster && this.toaster.childElementCount <= 0) {
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
      this._hide(toast);
    }, this.options.duration + this.options.animationDelay);
  }

  /**
   * Remove toast
   * @param {Element} toast
   */
  _removeToast(toast) {
    const height = toast.clientHeight;
    toast.style.height = height + 'px';

    setTimeout(() => {
      this._animOut(toast);
    }, this.options.duration + 2 * this.options.animationDelay);

    setTimeout(() => {
      this._deleteToast(toast);
      this._removeToaster();
    }, this.options.duration + 3 * this.options.animationDelay);
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
   * Delete toast
   * @param {Element} toast
   */
  _deleteToast(toast) {
    toast.remove();
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
  changeContent(newContent, newClasses) {
    this.content = newContent;
    newClasses === '' ? '' : (this.options.classes = newClasses);
  }

  /**
   * Change toast classes
   *@param {String} newContent
   */
  changeClasses(newClasses) {
    this.options.classes = newClasses;
  }

  _hide(toast, trigger, e) {
    let timer = 1;
    if (e) {
      e.preventDefault();
      timer = 0;
    }

    toast.style.opacity = 0;
    this.options.isClosable ? trigger.removeEventListener('click', trigger.listenerRef) : '';
    setTimeout(() => {
      this._animOut(toast);
    }, timer * this.options.animationDelay + this.options.animationDelay);
    setTimeout(() => {
      this._deleteToast(toast);
    }, this.options.animationDelay * timer + this.options.animationDelay * 2);
  }
}
