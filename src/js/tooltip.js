(() => {
  /**
   * Class Tooltip
   * @Class
   */
  class Tooltip extends AxentixComponent {
    static getDefaultOptions() {
      return {
        content: '',
        animationDelay: 0,
        offset: '10px',
        animationDuration: 200,
        classes: 'grey dark-4 light-shadow-2 p-2',
        position: 'top',
      };
    }

    /**
     * Tooltip constructor
     * @constructor
     * @param {Object} options
     */
    constructor(element, options, isLoadedWithData) {
      super();

      try {
        this.preventDbInstance(element);
        Axentix.instances.push({ type: 'Tooltip', instance: this });

        this.el = document.querySelector(element);
        this.options = Axentix.getComponentOptions('Tooltip', options, this.el, isLoadedWithData);

        this._setup();
      } catch (error) {
        console.error('[Axentix] Tooltip init error', error);
      }
    }

    _setup() {
      if (!this.options.content) {
        return console.error('Tooltip #' + this.el.id + ' : empty content.');
      }

      Axentix.createEvent(this.el, 'tooltip.setup');

      this.options.position = this.options.position.toLowerCase();

      const tooltips = document.querySelectorAll('.tooltip');

      tooltips.forEach((tooltip) => {
        tooltip.dataset.tooltipId
          ? tooltip.dataset.tooltipId === this.el.id
            ? (this.tooltip = tooltip)
            : ''
          : '';
      });

      this.tooltip ? '' : (this.tooltip = document.createElement('div'));
      this.tooltip.dataset.tooltipId === this.el.id ? '' : (this.tooltip.dataset.tooltipId = this.el.id);

      this._setProperties();
      document.body.appendChild(this.tooltip);

      this.positionList = ['right', 'left', 'top', 'bottom'];
      this.positionList.includes(this.options.position) ? '' : (this.options.position = 'top');

      this._setupListeners();

      this.updatePosition();
    }

    /**
     * Setup listeners
     */
    _setupListeners() {
      this.listenerEnterRef = this._onHover.bind(this);
      this.listenerLeaveRef = this._onHoverOut.bind(this);
      this.listenerResizeRef = this.updatePosition.bind(this);

      this.el.addEventListener('mouseenter', this.listenerEnterRef);
      this.el.addEventListener('mouseleave', this.listenerLeaveRef);
      window.addEventListener('resize', this.listenerResizeRef);
    }

    /**
     * Remove listeners
     */
    _removeListeners() {
      this.el.removeEventListener('mouseenter', this.listenerEnterRef);
      this.el.removeEventListener('mouseleave', this.listenerLeaveRef);
      this.el.removeEventListener('resize', this.listenerResizeRef);

      this.listenerEnterRef = undefined;
      this.listenerLeaveRef = undefined;
      this.listenerResizeRef = undefined;
    }

    /**
     * Set properties to tooltip
     */
    _setProperties() {
      this.tooltip.style.transform = 'translate(0)';
      this.tooltip.style.opacity = 0;
      this.tooltip.className = 'tooltip ' + this.options.classes;
      this.tooltip.style.transitionDuration = this.options.animationDuration + 'ms';
      this.tooltip.innerHTML = this.options.content;
    }

    /**
     * Set basic tooltip position
     */
    _setBasicPosition() {
      if (this.options.position == 'top' || this.options.position == 'bottom') {
        this.options.position == 'top'
          ? (this.tooltip.style.top = this.elRect.top + 'px')
          : (this.tooltip.style.top = this.elRect.top + this.elRect.height + 'px');
      } else if (this.options.position == 'left' || this.options.position == 'right') {
        this.options.position == 'right'
          ? (this.tooltip.style.left = this.elRect.left + this.elRect.width + 'px')
          : '';
      }
    }

    /**
     * Manually transform the tooltip location
     */
    _manualTransform() {
      if (this.options.position == 'top' || this.options.position == 'bottom') {
        this.tooltip.style.left =
          this.elRect.left + this.elRect.width / 2 - this.tooltipRect.width / 2 + 'px';
      } else if (this.options.position == 'left' || this.options.position == 'right') {
        this.tooltip.style.top =
          this.elRect.top + this.elRect.height / 2 - this.tooltipRect.height / 2 + 'px';
      }

      if (this.options.position == 'top') {
        this.tooltip.style.top = this.tooltipRect.top - this.tooltipRect.height + 'px';
      } else if (this.options.position == 'left') {
        this.tooltip.style.left = this.elRect.left - this.tooltipRect.width + 'px';
      }

      const scrollY = window.scrollY;
      const tooltipTop = parseFloat(this.tooltip.style.top);

      this.options.position === 'top'
        ? (this.tooltip.style.top = scrollY * 2 + tooltipTop + 'px')
        : (this.tooltip.style.top = scrollY + tooltipTop + 'px');
    }

    /**
     * Handle hover event
     * @param {Event} e
     */
    _onHover(e) {
      e.preventDefault();
      this.show();
    }

    /**
     * Handle hover event
     * @param {Event} e
     */
    _onHoverOut(e) {
      e.preventDefault();
      this.hide();
    }

    /**
     * Update current tooltip position
     */
    updatePosition() {
      this.elRect = this.el.getBoundingClientRect();

      this._setBasicPosition();

      this.tooltipRect = this.tooltip.getBoundingClientRect();

      this._manualTransform();
    }

    /**
     * Show tooltip
     */
    show() {
      this.updatePosition();

      setTimeout(() => {
        Axentix.createEvent(this.el, 'tooltip.show');

        this.options.position == 'top'
          ? (this.tooltip.style.transform = `translateY(-${this.options.offset})`)
          : this.options.position == 'right'
          ? (this.tooltip.style.transform = `translateX(${this.options.offset})`)
          : this.options.position == 'bottom'
          ? (this.tooltip.style.transform = `translateY(${this.options.offset})`)
          : this.options.position == 'left'
          ? (this.tooltip.style.transform = `translateX(-${this.options.offset})`)
          : '';

        this.tooltip.style.opacity = 1;
      }, this.options.animationDelay);
    }

    /**
     * Hide tooltip
     */
    hide() {
      Axentix.createEvent(this.el, 'tooltip.hide');

      this.tooltip.style.transform = 'translate(0)';
      this.tooltip.style.opacity = 0;
    }

    /**
     * Change current options
     * @param {Object} options
     */
    change(options = {}) {
      this.options = Axentix.getComponentOptions('Tooltip', options, this.el, true);

      this.positionList.includes(this.options.position) ? '' : (this.options.position = 'top');

      this._setProperties();
      this.updatePosition();
    }
  }

  Axentix.Config.registerComponent({
    class: Tooltip,
    name: 'Tooltip',
    dataDetection: true,
  });
})();
