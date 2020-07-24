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
        position: '',
      };
    }

    /**
     * Tooltip constructor
     * @constructor
     * @param {Object} options
     */
    constructor(element, options, isLoadedWithData) {
      super();

      this.el = document.querySelector(element);
      this.options = Axentix.getComponentOptions('Tooltip', options, this.el, isLoadedWithData);

      this._setup();
    }

    _setup() {
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
      this.tooltip.style.transform = 'translate(0)';
      this.tooltip.style.opacity = 0;

      this.tooltip.className = 'tooltip ' + this.options.classes;
      this.tooltip.style.transitionDuration = this.options.animationDuration + 'ms';
      this.tooltip.innerHTML = this.options.content;
      document.body.appendChild(this.tooltip);

      const positionList = ['right', 'left', 'top', 'bottom'];
      positionList.includes(this.options.position) ? '' : (this.options.position = 'bottom');

      this._setupListeners();

      this.updatePosition();
    }

    /**
     * Setup listeners
     */
    _setupListeners() {
      this.listenerEnterRef = this._onHover.bind(this);
      this.listenerLeaveRef = this._onHoverOut.bind(this);

      this.el.addEventListener('mouseenter', this.listenerEnterRef);
      this.el.addEventListener('mouseleave', this.listenerLeaveRef);

      this.resizeRef = this.updatePosition.bind(this);
      window.addEventListener('resize', this.resizeRef);
    }

    /**
     * Remove listeners
     */
    _removeListeners() {
      this.el.removeEventListener('mouseenter', this.listenerEnterRef);
      this.listenerEnterRef = undefined;

      this.el.removeEventListener('mouseleave', this.listenerLeaveRef);
      this.listenerLeaveRef = undefined;

      window.removeEventListener('resize', this.resizeRef);
      this.resizeRef = undefined;
    }

    /**
     * Set basic tooltip position
     */
    _setBasicPosition() {
      if (this.options.position == 'top' || this.options.position == 'bottom') {
        this.options.position == 'top'
          ? (this.tooltip.style.top = this.elRect.top)
          : (this.tooltip.style.top = this.elRect.top + this.elRect.height);
      } else if (this.options.position == 'left' || this.options.position == 'right') {
        this.options.position == 'right'
          ? (this.tooltip.style.left = this.elRect.left + this.elRect.width)
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
    }

    /**
     * Handle hover event
     * @param {Event} e
     */
    _onHover(e) {
      e.preventDefault();

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
    }

    /**
     * Handle hover event
     * @param {Event} e
     */
    _onHoverOut(e) {
      e.preventDefault();

      this.tooltip.style.transform = 'translate(0)';
      this.tooltip.style.opacity = 0;
    }

    /** Update current tooltip position */
    updatePosition() {
      this.elRect = this.el.getBoundingClientRect();

      this._setBasicPosition();

      this.tooltipRect = this.tooltip.getBoundingClientRect();
      this._manualTransform();
    }
  }
  Axentix.Tooltip = Tooltip;
})();
