function detectInput(input) {
  const isActive = input.parentElement.classList.contains('active');
  const hasContent =
    input.value.length > 0 || input.placeholder.length > 0 || document.activeElement === input;
  updateInput(input, isActive, hasContent);
}

/**
 * Update input field
 * @param {Element} input
 * @param {boolean} isActive
 * @param {boolean} hasContent
 */
function updateInput(input, isActive, hasContent) {
  if (!isActive && hasContent) {
    input.parentElement.classList.add('active');
  } else if (isActive && !hasContent) {
    input.parentElement.classList.remove('active');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const inputElements = document.querySelectorAll('.form-material .form-field .form-control');
  if (inputElements.length > 0) {
    inputElements.forEach(input => {
      detectInput(input);
      input.addEventListener('input', () => {
        detectInput(input);
      });
    });

    document.addEventListener(
      'focus',
      e => {
        inputElements.forEach(input => {
          input === e.target ? detectInput(input) : '';
        });
      },
      true
    );

    document.addEventListener(
      'blur',
      e => {
        inputElements.forEach(input => {
          input === e.target ? detectInput(input) : '';
        });
      },
      true
    );
  }
});
