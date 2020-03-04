Axentix.inputElements = document.querySelectorAll(
  '.form-material .form-field:not(.form-default) .form-control'
);

/**
 * Detect attribute & state of all inputs
 * @param {NodeListOf<Element>} inputElements
 */
Axentix.detectAllInputs = function(inputElements) {
  inputElements ? '' : (inputElements = Axentix.inputElements);

  inputElements.forEach(input => {
    Axentix.detectInput(input);
  });
};

/**
 * Detect attribute & state of an input
 * @param {Element} input
 */
Axentix.detectInput = function(input) {
  Axentix.createEvent(input, 'form.input');
  const isActive = input.parentElement.classList.contains('active');
  const hasContent =
    input.value.length > 0 ||
    input.placeholder.length > 0 ||
    input.matches('[type="date"]') ||
    input.matches('[type="month"]') ||
    input.matches('[type="week"]') ||
    input.matches('[type="time"]');
  const isFocused = document.activeElement === input;
  const isDisabled = input.hasAttribute('disabled') || input.hasAttribute('readonly');

  if (input.firstInit) {
    Axentix.updateInput(input, isActive, hasContent, isFocused);
    input.firstInit = false;
  } else {
    isDisabled ? '' : Axentix.updateInput(input, isActive, hasContent, isFocused);
  }
};

/**
 * Update input field
 * @param {Element} input
 * @param {boolean} isActive
 * @param {boolean} hasContent
 * @param {boolean} isFocused
 */
Axentix.updateInput = function(input, isActive, hasContent, isFocused) {
  const isTextArea = input.type === 'textarea';
  if (!isActive && (hasContent || isFocused)) {
    isTextArea ? '' : Axentix.setFormPosition(input);
    input.parentElement.classList.add('active');
  } else if (isActive && !(hasContent || isFocused)) {
    input.parentElement.classList.remove('active');
  }

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
Axentix.setFormPosition = function(input) {
  const style = window.getComputedStyle(input.parentElement);
  const height = parseFloat(input.clientHeight),
    padding = parseFloat(style.paddingTop),
    border = parseFloat(style.borderTopWidth);

  const pos = padding + border + height + 'px';

  input.parentElement.style.setProperty('--form-material-position', pos);
};

/**
 * Handle listeners
 * @param {Event} e
 * @param {NodeListOf<Element>} inputElements
 */
Axentix.handleListeners = function(e, inputElements) {
  inputElements.forEach(input => {
    input === e.target ? Axentix.detectInput(input) : '';
  });
};

/**
 * Handle form reset event
 * @param {Event} e
 */
Axentix.handleResetEvent = function(e) {
  if (e.target.tagName === 'FORM' && e.target.classList.contains('form-material')) {
    setTimeout(() => {
      Axentix.detectAllInputs();
    }, 10);
  }
};

/**
 * Setup forms fields listeners
 * @param {NodeListOf<Element>} inputElements
 */
Axentix.setupFormsListeners = function(inputElements) {
  inputElements ? '' : (inputElements = Axentix.inputElements);

  inputElements.forEach(input => {
    input.addEventListener('input', Axentix.detectInput(input));
    input.firstInit = true;
  });

  document.addEventListener('focus', e => Axentix.handleListeners(e, inputElements), true);
  document.addEventListener('blur', e => Axentix.handleListeners(e, inputElements), true);

  window.addEventListener('pageshow', () => {
    setTimeout(() => {
      Axentix.detectAllInputs();
    }, 10);
  });
  document.addEventListener('reset', Axentix.handleResetEvent);
};

// Init
document.addEventListener('DOMContentLoaded', () => {
  if (Axentix.inputElements.length > 0) {
    Axentix.setupFormsListeners();
    Axentix.detectAllInputs();
  }
});
