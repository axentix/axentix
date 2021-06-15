Axentix.Forms = (() => {
  let isInit = true;

  /**
   * Detect attribute & state of all inputs
   * @param {NodeListOf<Element>} inputElements
   */
  const detectAllInputs = (inputElements) => {
    inputElements.forEach(detectInput);
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
    const formField = input.parentElement.classList.contains('form-group')
      ? input.parentElement.parentElement
      : input.parentElement;

    const isActive = formField.classList.contains('active');
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
      updateInput(input, isActive, hasContent, isFocused, formField);
      input.firstInit = false;
      input.isInit = true;
    } else {
      isDisabled ? '' : updateInput(input, isActive, hasContent, isFocused, formField);
    }
  };

  /**
   * Update input field
   * @param {Element} input
   * @param {boolean} isActive
   * @param {boolean} hasContent
   * @param {boolean} isFocused
   */
  const updateInput = (input, isActive, hasContent, isFocused, formField) => {
    const isTextArea = input.type === 'textarea';

    if (!isActive && (hasContent || isFocused)) {
      formField.classList.add('active');
    } else if (isActive && !(hasContent || isFocused)) {
      formField.classList.remove('active');
    }

    isTextArea ? '' : setFormPosition(input, formField);

    isFocused && !isTextArea
      ? formField.classList.add('is-focused')
      : formField.classList.remove('is-focused');

    isFocused && isTextArea
      ? formField.classList.add('is-txtarea-focused')
      : formField.classList.remove('is-txtarea-focused');
  };

  /**
   * Add bottom position variable to form
   * @param {Element} input
   * @param {Element} formField
   */
  const setFormPosition = (input, formField) => {
    const inputWidth = input.clientWidth,
      inputLeftOffset = input.offsetLeft;

    const topOffset = input.clientHeight + input.offsetTop + 'px';

    formField.style.setProperty('--form-material-position', topOffset);

    let offset = inputLeftOffset,
      side = 'left',
      width = inputWidth + 'px',
      labelLeft = '0';

    if (formField.classList.contains('form-rtl')) {
      side = 'right';
      offset = formField.clientWidth - inputWidth - inputLeftOffset;
    }

    formField.style.setProperty(`--form-material-${side}-offset`, offset + 'px');

    if (offset != 0) labelLeft = inputLeftOffset;
    formField.style.setProperty('--form-material-width', width);

    const label = formField.querySelector('label');
    if (label) label.style.left = labelLeft + 'px';
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

    const detectAllInputsRef = detectAllInputs.bind(null, inputElements);
    window.addEventListener('resize', detectAllInputsRef);
  };

  const handleFileInput = (input, filePath) => {
    const files = input.files;
    if (files.length > 1) {
      filePath.innerHTML = Array.from(files)
        .reduce((acc, file) => {
          acc.push(file.name);
          return acc;
        }, [])
        .join(', ');
    } else if (files[0]) {
      filePath.innerHTML = files[0].name;
    }
  };

  const setupFormFile = (element) => {
    if (element.isInit) {
      return;
    }

    element.isInit = true;
    const input = element.querySelector('input[type="file"]');
    const filePath = element.querySelector('.form-file-path');
    input.handleRef = handleFileInput.bind(null, input, filePath);
    input.addEventListener('change', input.handleRef);
  };

  const updateInputsFile = () => {
    const elements = Array.from(document.querySelectorAll('.form-file'));
    try {
      elements.map(setupFormFile);
    } catch (error) {
      console.error('[Axentix] Form file error', error);
    }
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

    updateInputsFile();

    try {
      setupInputs.length > 0 ? setupFormsListeners(setupInputs) : '';
      detectInputs.length > 0 ? detectAllInputs(detectInputs) : '';
    } catch (error) {
      console.error('[Axentix] Material forms error', error);
    }
  };
})();

// Init
document.addEventListener('DOMContentLoaded', () => Axentix.updateInputs());
