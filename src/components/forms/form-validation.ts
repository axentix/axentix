const checkBrowserValidity = (input: HTMLInputElement): boolean | string => {
  return input.checkValidity() || input.validationMessage;
};

const checkValidity = (input: HTMLInputElement, rules?: Array<Function>): boolean | string => {
  for (const rule of rules) {
    const res = rule(input.value);
    if (res !== true) return res;
  }

  return true;
};

export const validateInput = (input: HTMLInputElement, rules?: Array<Function>) => {
  const isValid = rules && rules.length > 0 ? checkValidity(input, rules) : checkBrowserValidity(input);

  console.log(isValid);

  const formField = input.parentElement.classList.contains('form-group')
    ? input.parentElement.parentElement
    : input.parentElement;

  formField.classList.remove('form-valid', 'form-invalid');

  if (isValid) formField.classList.add('form-valid');
  else formField.classList.add('form-invalid');
};
