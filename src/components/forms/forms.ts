import { getCssVar } from '../../utils/config';
import { validateInput } from './forms-validation';

let isInit = true;

/**
 * Detect attribute & state of all inputs
 */
const detectAllInputs = (inputElements: NodeListOf<Element>) => {
  inputElements.forEach(detectInput);
};

/**
 * Delay detection of all inputs
 */
const delayDetectionAllInputs = (inputElements: NodeListOf<Element>) => {
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
 */
const detectInput = (input: any) => {
  const formField = input.closest('.form-field');
  const customSelect = formField.querySelector('.form-custom-select');

  const isActive = formField.classList.contains('active');
  const types = ['date', 'month', 'week', 'time'];

  let hasContent = customSelect && input.tagName === 'DIV' && input.innerText.length > 0;
  if (!customSelect)
    hasContent =
      input.value.length > 0 ||
      (input.tagName !== 'SELECT' && input.placeholder.length > 0) ||
      input.tagName === 'SELECT' ||
      types.some((type) => input.matches(`[type="${type}"]`));

  const isFocused = document.activeElement === input;
  const isDisabled = input.hasAttribute('disabled') || input.hasAttribute('readonly');

  if (input.firstInit) {
    updateInput(input, isActive, hasContent, isFocused, formField, customSelect);
    input.firstInit = false;
    input.isInit = true;
  } else {
    if (!isDisabled) updateInput(input, isActive, hasContent, isFocused, formField, customSelect);
  }
};

/**
 * Update input field
 */
const updateInput = (
  input: any,
  isActive: boolean,
  hasContent: boolean,
  isFocused: boolean,
  formField,
  customSelect: HTMLDivElement
) => {
  const isTextArea = input.type === 'textarea';
  const label = formField.querySelector('label:not(.form-check)');

  if (!isActive && (hasContent || isFocused)) {
    formField.classList.add('active');
  } else if (isActive && !(hasContent || isFocused)) {
    formField.classList.remove('active');
  }

  if (!isTextArea) setFormPosition(input, formField, customSelect, label);
  else if (label) label.style.backgroundColor = getLabelColor(label);

  if (isFocused && !isTextArea) formField.classList.add('is-focused');
  else if (!customSelect) formField.classList.remove('is-focused');

  if (isFocused && isTextArea) formField.classList.add('is-textarea-focused');
  else formField.classList.remove('is-textarea-focused');
};

/**
 * Add bottom position variable to form
 */
const setFormPosition = (
  input: HTMLElement,
  formField: HTMLElement,
  customSelect: HTMLDivElement,
  label?: HTMLLabelElement
) => {
  const inputWidth = input.clientWidth,
    inputLeftOffset = input.offsetLeft;

  const topOffset = input.clientHeight + (customSelect ? customSelect.offsetTop : input.offsetTop) + 'px';
  const isBordered = input.closest('.form-material').classList.contains('form-material-bordered');

  formField.style.setProperty(getCssVar('form-material-position'), topOffset);

  let offset = inputLeftOffset,
    side = 'left',
    width = inputWidth + 'px',
    labelLeft = 0;

  if (formField.classList.contains('form-rtl')) {
    side = 'right';
    offset = formField.clientWidth - inputWidth - inputLeftOffset;
  }

  formField.style.setProperty(getCssVar(`form-material-${side}-offset`), offset + 'px');

  if (offset != 0) labelLeft = inputLeftOffset;
  formField.style.setProperty(getCssVar('form-material-width'), width);

  if (label) {
    label.style.left = labelLeft + 'px';

    if (isBordered) label.style.backgroundColor = getLabelColor(label);
  }
};

const extractBgColor = (target: HTMLElement) => {
  const bg = window.getComputedStyle(target).backgroundColor;
  if (bg && !['transparent', 'rgba(0, 0, 0, 0)'].includes(bg)) return bg;
};

const getLabelColor = (label: HTMLElement) => {
  label.style.backgroundColor = '';
  let target = label;

  while (target.parentElement) {
    const bg = extractBgColor(target);
    if (bg) return bg;

    target = target.parentElement;
  }

  const htmlBg = extractBgColor(document.documentElement);
  if (htmlBg) return htmlBg;

  return 'white';
};

const validate = (input: HTMLInputElement, e: Event) => {
  if (input.hasAttribute(`data-form-validate`)) validateInput(input, e.type);
};

/**
 * Handle listeners
 */
const handleListeners = (inputs: NodeListOf<Element>, e: Event) => {
  inputs.forEach((input) => {
    if (input === e.target) detectInput(input);
  });
};

/**
 * Handle form reset event
 */
const handleResetEvent = (inputs: NodeListOf<Element>, e: any) => {
  if (e.target.tagName === 'FORM' && e.target.classList.contains('form-material'))
    delayDetectionAllInputs(inputs);
};

/**
 * Setup forms fields listeners
 */
const setupFormsListeners = (inputElements: any) => {
  inputElements.forEach((input) => {
    input.firstInit = true;
    input.validateRef = validate.bind(null, input);
    input.addEventListener('input', input.validateRef);
    input.addEventListener('change', input.validateRef);
  });
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

const handleFileInput = (input: HTMLInputElement, filePath: HTMLElement) => {
  const files = input.files;
  if (files.length > 1) {
    filePath.innerHTML = Array.from(files)
      .map((file) => file.name)
      .join(', ');
  } else if (files[0]) {
    filePath.innerHTML = files[0].name;
  }
};

const setupFormFile = (element) => {
  if (element.isInit) return;

  element.isInit = true;
  const input = element.querySelector('input[type="file"]');
  const filePath = element.querySelector('.form-file-path');
  input.handleRef = handleFileInput.bind(null, input, filePath);
  input.validateRef = validate.bind(null, input);
  input.addEventListener('change', input.handleRef);
  input.addEventListener('input', input.validateRef);
  input.addEventListener('change', input.validateRef);
};

const updateInputsFile = () => {
  const elements = Array.from(document.querySelectorAll('.form-file'));
  try {
    elements.forEach(setupFormFile);
  } catch (error) {
    console.error('[Axentix] Form file error', error);
  }
};

/**
 * Update inputs state
 */
export const updateInputs = (
  inputElements: NodeListOf<HTMLElement> | Array<HTMLElement> = document.querySelectorAll(
    '.form-material .form-field:not(.form-default) .form-control:not(.form-custom-select)'
  )
) => {
  const { setupInputs, detectInputs } = Array.from(inputElements).reduce(
    (acc, el: any) => {
      if (el.isInit) acc.detectInputs.push(el);
      else acc.setupInputs.push(el);

      return acc;
    },
    { setupInputs: [], detectInputs: [] }
  );

  updateInputsFile();

  try {
    if (setupInputs.length > 0) setupFormsListeners(setupInputs);
    if (detectInputs.length > 0) detectAllInputs(detectInputs as unknown as NodeListOf<HTMLElement>);
  } catch (error) {
    console.error('[Axentix] Material forms error', error);
  }
};

// Init
document.addEventListener('DOMContentLoaded', () => updateInputs());
