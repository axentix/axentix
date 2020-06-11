Axentix.Forms = (() => {
  let isInit = true;

  /**
   * Detect attribute & state of all inputs
   * @param {NodeListOf<Element>} inputElements
   */
  const detectAllInputs = (inputElements) => {
    inputElements.forEach((input) => detectInput(input));
  };

  /**
   * Delay detection of all inputs
   * @param {NodeListOf<Element>} inputElements
   */
  const delayDetectionAllInputs = (inputElements) => {
    if (isInit) {
      isInit = false;
      return;
    }

    setTimeout(() => {
      detectAllInputs(inputElements);
    }, 10);
  };

  /**
   * Detect attribute & state of an input
   * @param {Element} input
   */
  const detectInput = (input) => {
    Axentix.createEvent(input, 'form.input');

    const isActive = input.parentElement.classList.contains('active');
    const hasContent =
      input.value.length > 0 ||
      (input.tagName !== 'SELECT' && input.placeholder.length > 0) ||
      input.tagName === 'SELECT' ||
      input.matches('[type="date"]') ||
      input.matches('[type="month"]') ||
      input.matches('[type="week"]') ||
      input.matches('[type="time"]');
    const isFocused = document.activeElement === input;
    const isDisabled = input.hasAttribute('disabled') || input.hasAttribute('readonly');

    if (input.firstInit) {
      updateInput(input, isActive, hasContent, isFocused);
      input.firstInit = false;
      input.isInit = true;
    } else {
      isDisabled ? '' : updateInput(input, isActive, hasContent, isFocused);
    }
  };

  /**
   * Update input field
   * @param {Element} input
   * @param {boolean} isActive
   * @param {boolean} hasContent
   * @param {boolean} isFocused
   */
  const updateInput = (input, isActive, hasContent, isFocused) => {
    const isTextArea = input.type === 'textarea';
    if (!isActive && (hasContent || isFocused)) {
      input.parentElement.classList.add('active');
    } else if (isActive && !(hasContent || isFocused)) {
      input.parentElement.classList.remove('active');
    }

    isTextArea ? '' : setFormPosition(input);

    isFocused && !isTextArea
      ? input.parentElement.classList.add('is-focused')
      : input.parentElement.classList.remove('is-focused');

    isFocused && isTextArea
      ? input.parentElement.classList.add('is-txtarea-focused')
      : input.parentElement.classList.remove('is-txtarea-focused');
  };

  /**
   * Add bottom position variable to form
   * @param {Element} input
   */
  const setFormPosition = (input) => {
    const style = window.getComputedStyle(input.parentElement);
    const height = parseFloat(input.clientHeight),
      padding = parseFloat(style.paddingTop),
      border = parseFloat(style.borderTopWidth);

    const pos = padding + border + height + 'px';

    input.parentElement.style.setProperty('--form-material-position', pos);
  };

  /**
   * Handle listeners
   * @param {NodeListOf<Element>} inputs
   * @param {Event} e
   */
  const handleListeners = (inputs, e) => {
    inputs.forEach((input) => {
      input === e.target ? detectInput(input) : '';
    });
  };

  /**
   * Handle form reset event
   * @param {NodeListOf<Element>} inputs
   * @param {Event} e
   */
  const handleResetEvent = (inputs, e) => {
    if (e.target.tagName === 'FORM' && e.target.classList.contains('form-material')) {
      delayDetectionAllInputs(inputs);
    }
  };

  /**
   * Setup forms fields listeners
   * @param {NodeListOf<Element>} inputElements
   */
  const setupFormsListeners = (inputElements) => {
    inputElements.forEach((input) => (input.firstInit = true));
    detectAllInputs(inputElements);

    const handleListenersRef = handleListeners.bind(null, inputElements);
    document.addEventListener('focus', handleListenersRef, true);
    document.addEventListener('blur', handleListenersRef, true);

    const delayDetectionAllInputsRef = delayDetectionAllInputs.bind(null, inputElements);
    window.addEventListener('pageshow', delayDetectionAllInputsRef);

    const handleResetRef = handleResetEvent.bind(null, inputElements);
    document.addEventListener('reset', handleResetRef);
  };

  /**
   * Update inputs state
   * @param {NodeListOf<Element>} inputElements
   */
  Axentix.updateInputs = (
    inputElements = document.querySelectorAll('.form-material .form-field:not(.form-default) .form-control')
  ) => {
    const setupInputs = Array.from(inputElements).filter((el) => !el.isInit);
    const detectInputs = Array.from(inputElements).filter((el) => el.isInit);

    setupInputs.length > 0 ? setupFormsListeners(setupInputs) : '';
    detectInputs.length > 0 ? detectAllInputs(detectInputs) : '';
  };
})();

// Init
document.addEventListener('DOMContentLoaded', () => Axentix.updateInputs());
