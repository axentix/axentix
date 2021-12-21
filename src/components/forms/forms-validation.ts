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

export const validateInput = (input: HTMLInputElement, evtType: string) => {
  const advancedMode = input.getAttribute(`${config.prefix}-form-validate`);
  let auto = false;

  if (advancedMode) {
    const advSplit = advancedMode.toLowerCase().split(',');
    auto = advSplit.includes('auto');

    if (advSplit.includes('lazy') && evtType === 'input') return;
  }

  const isValid = checkBrowserValidity(input);

  const formField = input.parentElement.classList.contains('form-group')
    ? input.parentElement.parentElement
    : input.parentElement;

  formField.classList.remove('form-valid', 'form-invalid', 'form-no-helper');

  if (isValid !== true) {
    if (auto && typeof isValid === 'string') setAdvancedMode(formField, isValid);
    else if (!formField.querySelector('.form-helper-invalid')) formField.classList.add('form-no-helper');
    return formField.classList.add('form-invalid');
  }

  if (auto) clearAdvancedMode(formField);
  formField.classList.add('form-valid');

  if (!formField.querySelector('.form-helper-valid')) formField.classList.add('form-no-helper');
};
