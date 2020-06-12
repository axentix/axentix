/**
 * Class Tooltip
 * @Class
 */
class Tooltip extends AxentixComponent {
  /**
   * Tooltip constructor
   * @constructor
   * @param {Object} options
   */
  constructor(element, options) {
    super();
    this.defaultOptions = {
      // do we keep animation delay ?
      animationDelay: 0,
      transitionDuration: 300,
      classes: 'grey dark-4 light-shadow-2 p-2',
      position: '',
    };

    this.el = document.querySelector(element);

    this.options = Axentix.extend(this.defaultOptions, options);
    this.options.position = this.options.position.toLowetCase();
    this._setup();
  }

  _setup() {
    this.tooltip = document.createElement('div');
    this.tooltip.classList.add('tooltip');
    this.tooltip.style.transitionDuration = this.options.transitionDuration;

    this.el.style.position = 'relative';

    const positionList = ['right', 'left', 'top', 'bottom'];
    positionList.includes(this.options.position) ? '' : (this.options.position = 'bottom');

    if (position == 'top' || position == 'bottom') {
      tooltip.isVertical = true;
      tooltip.style.left = '50%';
      tooltip.style.transform = 'translateX(-50%)';
    } else if (position == 'left' || position == 'right') {
      tooltip.isVertical = true;
      tooltip.style.top = '50%';
      tooltip.style.transform = 'translateY(-50%)';
    }

    position == 'top'
      ? (tooltip.style.top = '-100%')
      : position == 'bottom'
      ? (tooltip.style.bottom = '-100%')
      : position == 'left'
      ? (tooltip.style.left = '-100%')
      : position == 'right'
      ? (tooltip.style.right = '-100%')
      : '';

    this._setupListeners();
    // if (position == 'top') {
    //   tooltip.style.top = '-100%';
    // } else if (position == 'bottom') {
    //   tooltip.style.bottom = '-100%';
    // } else if (position == 'left') {
    //   tooltip.style.left = '-100%';
    // } else if (position == 'right') {
    //   tooltip.style.right = '-100%';
    // }
  }

  /**
   * Setup listeners
   */
  _setupListeners() {
    this.el.addEventListener('mouseenter', _onHover.bind(this));
    this.el.addEventListener('mouseleave', _onHoverOut.bind(this));
  }

  /**
   * Handle hover event
   * @param {Event} e
   */
  _onHover(e) {
    e.preventDefault();

    this.isVertical
      ? (this.tooltip.style.marginTop = this.tooltip.style.marginBottom = '1.5rem')
      : (this.tooltip.style.marginLeft = this.tooltip.style.marginRight = '1.5rem');

    this.tooltip.style.opacity = 1;
  }

  /**
   * Handle hover event
   * @param {Event} e
   */
  _onHoverOut(e) {
    e.preventDefault();

    this.tooltip.style.margin = 0;
    this.tooltip.style.opacity = 0;
  }
}
