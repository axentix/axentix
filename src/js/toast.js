(() => {
  /**
   * Class Toast
   * @class
   */
  class Toast {
    static getDefaultOptions() {
      return {
        animationDuration: 400,
        duration: 4000,
        classes: '',
        position: 'right',
        direction: 'top',
        mobileDirection: 'bottom',
        offset: { x: '5%', y: '0%', mobileX: '10%', mobileY: '0%' },
        isClosable: false,
        closableContent: 'x',
        loading: {
          enabled: true,
          border: '2px solid #E2E2E2'
        },
      };
    }

    /**
     * Construct Toast instance
     * @constructor
     * @param {String} content
     * @param {Object} options
     */

    constructor(content, options) {
      if (Axentix.getInstanceByType('Toast').length > 0) {
        console.error("[Axentix] Toast: Don't try to create multiple toast instances");
        return;
      }

      Axentix.instances.push({ type: 'Toast', instance: this });

      this.content = content;
      this.options = Axentix.getComponentOptions('Toast', options, '', true);
      this.options.position = this.options.position.toLowerCase();
      this.options.direction = this.options.direction.toLowerCase();
      this.options.mobileDirection = this.options.mobileDirection.toLowerCase();
      this.toasters = {};
    }

    destroy() {
      Axentix.createEvent(this.el, 'component.destroy');
      const index = Axentix.instances.findIndex((ins) => ins.instance.el.id === this.el.id);
      Axentix.instances.splice(index, 1);
    }

    /**
     * Create toast container
     */
    _createToaster() {
      let toaster = document.createElement('div');

      const positionList = ['right', 'left'];
      positionList.includes(this.options.position) ? '' : (this.options.position = 'right');

      this.options.position === 'right'
        ? (toaster.style.right = this.options.offset.x)
        : (toaster.style.left = this.options.offset.x);

      const directionList = ['bottom', 'top'];
      directionList.includes(this.options.direction) ? '' : (this.options.direction = 'top');

      this.options.direction === 'top'
        ? (toaster.style.top = this.options.offset.y)
        : (toaster.style.bottom = this.options.offset.y);

      directionList.includes(this.options.mobileDirection) ? '' : (this.options.mobileDirection = 'bottom');

      toaster.style.setProperty('--toaster-m-width', 100 - this.options.offset.mobileX.slice(0, -1) + '%');
      toaster.style.setProperty('--toaster-m-offset', this.options.offset.mobileY);

      if (this.options.loading.enabled) {
        toaster.style.setProperty('--toast-loading-border', this.options.loading.border);
      }

      toaster.className =
        'toaster toaster-' +
        this.options.position +
        ' toast-' +
        this.options.direction +
        ' toaster-m-' +
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
        if (this.options.loading.enabled) {
          toast.classList.add('loading');
          toast.style.setProperty('--toast-loading-duration', this.options.duration + 'ms');
        }
        toast.classList.add('toast-animated');

        setTimeout(() => {
          Axentix.createEvent(toast, 'toast.shown');
          if (this.options.loading.enabled) toast.classList.add('load');
        }, this.options.animationDuration);
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
      }, this.options.duration + this.options.animationDuration);
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
      toast.style.transitionDuration = this.options.animationDuration + 'ms';

      if (this.options.isClosable) {
        let trigger = document.createElement('div');
        trigger.className = 'toast-trigger';
        trigger.innerHTML = this.options.closableContent;
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
      const delay = timer * this.options.animationDuration + this.options.animationDuration;
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
      try {
        if (!Object.keys(this.toasters).includes(this.options.position)) {
          this._createToaster();
        }
        this._createToast();
      } catch (error) {
        console.error('[Axentix] Toast error', error);
      }
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

  Axentix.Config.registerComponent({
    class: Toast,
    name: 'Toast',
  });
})();
