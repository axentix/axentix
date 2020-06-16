/**
 * Class Tooltip
 * @Class
 */
class Tooltip extends AxentixComponent {
  /**
   * Tooltip constructor
   * @constructor
   * @param {String} content
   * @param {Object} options
   */
  constructor(element, content, options) {
    super();
    this.defaultOptions = {
      animationDelay: 0,
      offset: '10px',
      animationDuration: 200,
      classes: 'grey dark-4 light-shadow-2 p-2',
      position: '',
    };

    this.el = document.querySelector(element);
    this.content = content;
    this.options = Axentix.extend(this.defaultOptions, options);
    this.options.position = this.options.position.toLowerCase();
    this._setup();
  }

  _setup() {
    let tooltips = document.querySelectorAll('.tooltip');

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
    this.tooltip.innerHTML = this.content;
    document.body.appendChild(this.tooltip);

    this.elRect = this.el.getBoundingClientRect();

    const positionList = ['right', 'left', 'top', 'bottom'];
    positionList.includes(this.options.position) ? '' : (this.options.position = 'bottom');

    this.position = this.options.position;
    this._setBasicPosition();

    this.tooltipRect = this.tooltip.getBoundingClientRect();
    this._manualTransform();

    this._setupListeners();
  }

  /**
   * Set basic tooltip position
   */
  _setBasicPosition() {
    if (this.position == 'top' || this.position == 'bottom') {
      this.position == 'top'
        ? (this.tooltip.style.top = this.elRect.top)
        : (this.tooltip.style.top = this.elRect.top + this.elRect.height);
    } else if (this.position == 'left' || this.position == 'right') {
      this.position == 'right' ? (this.tooltip.style.left = this.elRect.left + this.elRect.width) : '';
    }
  }

  /**
   * Manually transform the tooltip location
   */
  _manualTransform() {
    if (this.position == 'top' || this.position == 'bottom') {
      this.tooltip.style.left = this.elRect.left + this.elRect.width / 2 - this.tooltipRect.width / 2 + 'px';
    } else if (this.position == 'left' || this.position == 'right') {
      this.tooltip.style.top = this.elRect.top + this.elRect.height / 2 - this.tooltipRect.height / 2 + 'px';
    }

    if (this.position == 'top') {
      this.tooltip.style.top = this.tooltipRect.top - this.tooltipRect.height + 'px';
    } else if (this.position == 'left') {
      this.tooltip.style.left = this.elRect.left - this.tooltipRect.width + 'px';
    }
  }

  /**
   * Setup listeners
   */
  _setupListeners() {
    this.listenerEnterRef = this._onHover.bind(this);
    this.listenerLeaveRef = this._onHoverOut.bind(this);
    this.el.addEventListener('mouseenter', this.listenerEnterRef);
    this.el.addEventListener('mouseleave', this.listenerLeaveRef);
  }

  /**
   * Remove listeners
   */
  _removeListeners() {
    this.el.removeEventListener('mouseenter', this.listenerEnterRef);
    this.listenerEnterRef = undefined;

    this.el.removeEventListener('mouseleave', this.listenerLeaveRef);
    this.listenerLeaveRef = undefined;
  }

  /**
   * Handle hover event
   * @param {Event} e
   */
  _onHover(e) {
    e.preventDefault();

    console.log(this.position);

    this.position == 'top'
      ? (this.tooltip.style.transform = `translateY(-${this.options.offset})`)
      : this.position == 'right'
      ? (this.tooltip.style.transform = `translateX(${this.options.offset})`)
      : this.position == 'bottom'
      ? (this.tooltip.style.transform = `translateY(${this.options.offset})`)
      : this.position == 'left'
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
}
