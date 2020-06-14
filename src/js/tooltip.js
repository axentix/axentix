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
      transitionDuration: 200,
      classes: '',
      position: '',
    };

    this.el = document.querySelector(element);
    this.content = content;
    this.options = Axentix.extend(this.defaultOptions, options);
    this.options.position = this.options.position.toLowerCase();
    this._setup();
  }

  _setup() {
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'tooltip ' + this.options.classes;
    this.tooltip.style.transitionDuration = this.options.transitionDuration + 'ms';
    this.tooltip.innerHTML = this.content;
    document.body.appendChild(this.tooltip);

    this.elRect = this.el.getBoundingClientRect();

    console.log(this.elRect);

    let position = this.options.position;

    const positionList = ['right', 'left', 'top', 'bottom'];
    positionList.includes(this.options.position) ? '' : (this.options.position = 'bottom');

    if (position == 'top' || position == 'bottom') {
      position == 'top'
        ? (this.tooltip.style.top = this.elRect.top)
        : (this.tooltip.style.top = this.elRect.top + this.elRect.height);
    } else if (position == 'left' || position == 'right') {
      position == 'right' ? (this.tooltip.style.left = this.elRect.left + this.elRect.width) : '';
    }

    this.tooltipRect = this.tooltip.getBoundingClientRect();
    // console.log(this.tooltipRect);

    // manual transform
    if (position == 'top' || position == 'bottom') {
      this.tooltip.style.left = this.elRect.left + this.elRect.width / 2 - this.tooltipRect.width / 2 + 'px';
    } else if (position == 'left' || position == 'right') {
      this.tooltip.style.top = this.elRect.top + this.elRect.height / 2 - this.tooltipRect.height / 2 + 'px';
    }

    if (position == 'top') {
      this.tooltip.style.top = this.tooltipRect.top - this.tooltipRect.height + 'px';
    } else if (position == 'left') {
      this.tooltip.style.left = this.elRect.left - this.tooltipRect.width + 'px';
    }

    this.position = position;
    this._setupListeners();
  }

  /**
   * Setup listeners
   */
  _setupListeners() {
    this.el.addEventListener('mouseenter', this._onHover.bind(this));
    this.el.addEventListener('mouseleave', this._onHoverOut.bind(this));
  }

  /**
   * Handle hover event
   * @param {Event} e
   */
  _onHover(e) {
    e.preventDefault();

    console.log(this.position);

    this.position == 'top'
      ? (this.tooltip.style.transform = 'translateY(-20px)')
      : this.position == 'right'
      ? (this.tooltip.style.transform = 'translateX(20px)')
      : this.position == 'bottom'
      ? (this.tooltip.style.transform = 'translateY(20px)')
      : this.position == 'left'
      ? (this.tooltip.style.transform = 'translateX(-20px)')
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
