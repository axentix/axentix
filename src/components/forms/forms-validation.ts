import { config } from '../../utils/config';

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

export const validateInput = (input: HTMLInputElement) => {
  const isValid = checkBrowserValidity(input);

  const hasAdvancedMode = input.getAttribute(`${config.prefix}-form-validate`);

  const formField = input.parentElement.classList.contains('form-group')
    ? input.parentElement.parentElement
    : input.parentElement;

  formField.classList.remove('form-valid', 'form-invalid', 'form-no-helper');

  if (isValid !== true) {
    if (hasAdvancedMode && typeof isValid === 'string') setAdvancedMode(formField, isValid);
    return formField.classList.add('form-invalid');
  }

  if (hasAdvancedMode) clearAdvancedMode(formField);
  formField.classList.add('form-valid');

  if (!formField.querySelector('.form-helper-valid')) formField.classList.add('form-no-helper');
};
