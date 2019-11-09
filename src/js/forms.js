/**
 * Detect attribute & state of all inputs
 * @param {NodeListOf<Element>} inputElements
 */
Axentix.detectAllInputs = function(inputElements) {
  inputElements.forEach(input => {
    Axentix.detectInput(input);
  });
};

/**
 * Detect attribute & state of an input
 * @param {Element} input
 */
Axentix.detectInput = function(input) {
  const isActive = input.parentElement.classList.contains('active');
  const hasContent =
    input.value.length > 0 || input.placeholder.length > 0 || document.activeElement === input;
  const isDisabled = input.hasAttribute('disabled') || input.hasAttribute('readonly');

  if (input.firstInit) {
    Axentix.updateInput(input, isActive, hasContent);
    input.firstInit = false;
  } else {
    isDisabled ? '' : Axentix.updateInput(input, isActive, hasContent);
  }
};

/**
 * Update input field
 * @param {Element} input
 * @param {boolean} isActive
 * @param {boolean} hasContent
 */
Axentix.updateInput = function(input, isActive, hasContent) {
  if (!isActive && hasContent) {
    input.parentElement.classList.add('active');
  } else if (isActive && !hasContent) {
    input.parentElement.classList.remove('active');
  }
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
 * Setup forms fields listeners
 * @param {NodeListOf<Element>} inputElements
 */
Axentix.setupFormsListeners = function(inputElements) {
  inputElements.forEach(input => {
    input.addEventListener('input', Axentix.detectInput(input));
    input.firstInit = true;
  });

  document.addEventListener('focus', e => Axentix.handleListeners(e, inputElements), true);
  document.addEventListener('blur', e => Axentix.handleListeners(e, inputElements), true);
};

// Init
document.addEventListener('DOMContentLoaded', () => {
  const inputElements = document.querySelectorAll('.form-material .form-field .form-control');
  if (inputElements.length > 0) {
    Axentix.setupFormsListeners(inputElements);
    Axentix.detectAllInputs(inputElements);
  }
});
