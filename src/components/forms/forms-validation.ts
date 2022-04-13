const checkBrowserValidity = (input: HTMLInputElement): boolean | string => {
  return input.checkValidity() || input.validationMessage;
};

const setAdvancedMode = (formField: HTMLElement, content: string) => {
  const helper = document.createElement('div');
  (helper as any).axGenerated = true;
  formField.appendChild(helper);

  helper.classList.add('form-helper-invalid');
  helper.innerHTML = content;
};

const clearAdvancedMode = (formField: HTMLElement) => {
  const helper = formField.querySelector('.form-helper-invalid');
  if (!helper) return;

  if ((helper as any).axGenerated) helper.remove();
};

const resetInputValidation = (formField: HTMLElement) => {
  formField.classList.remove('form-valid', 'form-invalid', 'form-no-helper');
  clearAdvancedMode(formField);
};

export const validateInput = (input: HTMLInputElement, eType: string): boolean => {
  const advancedMode = input.getAttribute('data-form-validate');
  let auto = false;

  if (advancedMode) {
    const advSplit = advancedMode.toLowerCase().split(',');
    auto = advSplit.includes('auto');

    if (advSplit.includes('lazy') && eType === 'input') return;
  }

  const isValid = checkBrowserValidity(input);

  const formField: HTMLElement = input.closest('.form-field, .form-file');

  resetInputValidation(formField);

  if (isValid !== true) {
    if (auto && typeof isValid === 'string') setAdvancedMode(formField, isValid);
    else if (!formField.querySelector('.form-helper-invalid')) formField.classList.add('form-no-helper');

    formField.classList.add('form-invalid');
    return false;
  }

  formField.classList.add('form-valid');

  if (!formField.querySelector('.form-helper-valid')) formField.classList.add('form-no-helper');
  return true;
};

export const resetValidation = (form: HTMLFormElement) => {
  const inputs = form.querySelectorAll(`[data-form-validate]`);
  inputs.forEach((input) => resetInputValidation(input.closest('.form-field, .form-file')));
};

export const validate = (form: HTMLFormElement): boolean => {
  const inputs = form.querySelectorAll(`[data-form-validate]`);
  return [...inputs].map((input: HTMLInputElement) => validateInput(input, 'change')).every((b) => b);
};
