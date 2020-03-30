/**
 * Class Stepper
 * @class
 */
class Stepper extends AxentixComponent {
  /**
   * Construct Stepper instance
   * @constructor
   * @param {String} element
   * @param {Object} options
   */
  constructor(element, options) {
    super();
    this.defaultOptions = {
      animationDelay: 300,
      animationType: 'none',
      linear: true,
      validation: true
    };

    this.el = document.querySelector(element);
    this.elQuery = element;

    this.options = Axentix.extend(this.defaultOptions, options);
    this._setup();
  }

  /**
   * Setup component
   */
  _setup() {
    Axentix.createEvent(this.el, 'stepper.setup');

    const animationList = ['none', 'slide'];
    animationList.includes(this.options.animationType) ? '' : (this.options.animationType = 'none');
    this.isAnimated = false;
    this.stepperMenu = document.querySelector(this.elQuery + ' .stepper-menu');
    this.stepperLinks = document.querySelectorAll(this.elQuery + ' .stepper-menu .stepper-link');
    this.stepperNext = [];
    this.stepperPrev = [];
    this._getItems();
    this.totalSteps = this.stepperLinks.length - 1;
    this.activeStep =
      Array.from(this.stepperLinks).filter(link => link.classList.contains('active'))[0] ||
      this.stepperLinks[0];

    this._setupListeners();
    this.el.style.transitionDuration = this.options.animationDelay + 'ms';

    this._createTabInstance();
  }

  /**
   * Setup listeners
   */
  _setupListeners() {
    this.nextRef = this.next.bind(this);
    this.stepperNext.map(nextElem => nextElem.addEventListener('click', this.nextRef));

    this.prevRef = this.prev.bind(this);
    this.stepperPrev.map(prevElem => prevElem.addEventListener('click', this.prevRef));

    this.submitRef = this.submit.bind(this);
    this.stepperSubmit.addEventListener('click', this.submitRef);
  }

  /**
   * Remove listeners
   */
  _removeListeners() {
    this.stepperNext.map(nextElem => nextElem.removeEventListener('click', this.nextRef));
    this.nextRef = undefined;

    this.stepperPrev.map(prevElem => prevElem.removeEventListener('click', this.prevRef));
    this.prevRef = undefined;

    this.stepperSubmit.removeEventListener('click', this.submitRef);
    this.submitRef = undefined;
  }

  /**
   * Get all items
   */
  _getItems() {
    this.stepperItems = Array.from(this.el.children).reduce((acc, child) => {
      if (!child.classList.contains('stepper-menu')) {
        acc.push(child);

        const next = child.querySelector('.stepper-next');
        next ? this.stepperNext.push(next) : '';
        const prev = child.querySelector('.stepper-prev');
        prev ? this.stepperPrev.push(prev) : '';
        const submit = child.querySelector('.stepper-submit');
        submit ? (this.stepperSubmit = submit) : '';
      }
      return acc;
    }, []);
  }

  _createTabInstance() {
    this.el.classList.add('tab');
    this.stepperMenu.classList.add('tab-menu');
    this.stepperLinks.forEach(link => link.classList.add('tab-link'));
    this.tabInstance = new Tab(this.elQuery, {
      animationDelay: this.options.animationDelay,
      animationType: this.options.animationType,
      disableActiveBar: true
    });
  }

  /**
   * Go to previous step
   * @param {Event} e
   */
  prev(e) {
    e.preventDefault();
    if (this.tabInstance.currentItemIndex === 0) {
      return;
    }
    this.tabInstance.prev();
  }

  /**
   * Go to next step
   * @param {Event} e
   */
  next(e) {
    e.preventDefault();
    if (this.tabInstance.currentItemIndex === this.totalSteps) {
      return;
    }
    this.tabInstance.next();
  }

  /**
   * Submit stepper
   * @param {Event} e
   */
  submit(e) {
    if (!this.options.validation) {
      return;
    }
    e.preventDefault();
  }
}
Axentix.Stepper = Stepper;
