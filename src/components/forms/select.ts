import { wrap, unwrap, getUid, getComponentOptions } from '../../utils/utilities';
import { Dropdown } from '../dropdown/dropdown';
import { updateInputs } from './forms';
import { AxentixComponent, Component } from '../../utils/component';
import { registerComponent, instances, getComponentClass } from '../../utils/config';

interface ISelectOptions {
  inputClasses?: string;
}

const SelectOptions: ISelectOptions = {
  inputClasses: '',
};

export class Select extends AxentixComponent implements Component {
  static getDefaultOptions = () => SelectOptions;

  declare el: HTMLSelectElement;
  options: ISelectOptions;

  #dropdownInstance: Dropdown;
  #container: HTMLDivElement;
  #input: HTMLDivElement;
  #label: HTMLLabelElement;
  #clickRef: any;

  constructor(element: string, options?: ISelectOptions) {
    super();

    try {
      this.preventDbInstance(element);
      instances.push({ type: 'Select', instance: this });

      this.el = document.querySelector(element);

      this.options = getComponentOptions('Select', options, this.el);

      this.setup();
    } catch (error) {
      console.error('[Axentix] Select init error', error);
    }
  }

  setup() {
    this.el.style.display = 'none';
    this.#container = wrap([this.el]);
    this.#container.className = 'form-custom-select';

    this.#setupDropdown();
  }

  reset() {
    this.destroy(true);
    super.reset();
  }

  destroy(withoutSuperCall?: boolean) {
    if (!withoutSuperCall) super.destroy();

    if (this.#dropdownInstance) {
      this.#dropdownInstance.el.removeEventListener('ax.dropdown.open', this.#clickRef);
      this.#dropdownInstance.el.removeEventListener('ax.dropdown.close', this.#clickRef);
      this.#clickRef = null;

      this.#dropdownInstance.destroy();
      this.#dropdownInstance.el.remove();
      this.#dropdownInstance = null;
    }

    unwrap(this.#container);
    this.el.classList.add('form-custom-select');
    this.el.style.display = '';
  }

  #setupDropdown() {
    const uid = `dropdown-${getUid()}`;

    this.#input = document.createElement('div');
    this.#input.className = `form-control ${this.options.inputClasses}`;
    this.#input.dataset.target = uid;

    const dropdownContent = document.createElement('div');
    const classes = this.el.className.replace('form-control', '');
    dropdownContent.className = `dropdown-content ${classes}`;

    if (this.el.disabled) {
      this.#input.setAttribute('disabled', '');
      this.#container.append(this.#input);
      this.#setupContent(dropdownContent);
      return;
    }

    this.#clickRef = this.#setFocusedClass.bind(this);

    const dropdown = document.createElement('div');
    dropdown.className = 'dropdown';
    dropdown.id = uid;
    dropdown.addEventListener('ax.dropdown.open', this.#clickRef);
    dropdown.addEventListener('ax.dropdown.close', this.#clickRef);

    Array.from(this.el.attributes).forEach((a) => {
      if (a.name.startsWith('data-dropdown')) dropdown.setAttribute(a.name, a.value);
    });
    dropdown.append(this.#input);
    dropdown.append(dropdownContent);

    this.#container.append(dropdown);

    this.#setupContent(dropdownContent);

    const dropdownClass = getComponentClass('Dropdown');
    this.#dropdownInstance = new dropdownClass(`#${uid}`, {
      closeOnClick: !this.el.multiple,
      preventViewport: true,
    });

    // Fix zindex & marginTop of label when .form-material-bordered is used
    const zindex = window.getComputedStyle(dropdown).zIndex;
    this.#label = this.el.closest('.form-field').querySelector('label:not(.form-check)');
    if (this.#label) this.#label.style.zIndex = zindex + 5;
  }

  #createCheckbox(content: string, isDisabled: boolean) {
    const formField = document.createElement('div');
    formField.className = 'form-field';

    const label = document.createElement('label');
    label.className = 'form-check';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    if (isDisabled) checkbox.setAttribute('disabled', '');

    const span = document.createElement('span');
    span.innerHTML = content;

    label.append(checkbox, span);
    formField.append(label);

    return formField;
  }

  #setupContent(dropdownContent: HTMLDivElement) {
    for (const option of this.el.options) {
      const isDisabled = option.hasAttribute('disabled');

      const item = document.createElement('div');
      item.className = 'dropdown-item';
      item.innerHTML = this.el.multiple
        ? this.#createCheckbox(option.text, isDisabled).innerHTML
        : option.text;
      (item as any).axValue = option.value || option.text;

      if (!isDisabled) {
        (item as any).axClickRef = this.#onClick.bind(this, item);
        item.addEventListener('click', (item as any).axClickRef);
      } else item.classList.add('form-disabled');

      if (
        option.hasAttribute('selected') ||
        (!this.el.multiple && this.el.value === (option.value || option.text))
      )
        this.#select(item);

      dropdownContent.append(item);
    }
  }

  #setFocusedClass() {
    this.#input.closest('.form-field').classList.toggle('is-focused');
  }

  #onClick(item: any, e: Event) {
    e.preventDefault();

    if (!item.classList.contains('form-selected')) this.#select(item);
    else this.#unSelect(item);
  }

  #select(item: HTMLDivElement) {
    const value = (item as any).axValue;

    if (this.el.multiple) item.querySelector('input').checked = true;
    else if (this.#dropdownInstance)
      this.#dropdownInstance.el
        .querySelectorAll('.dropdown-item')
        .forEach((i) => i.classList.remove('form-selected'));

    item.classList.add('form-selected');
    const computedValue = this.el.multiple
      ? [...this.#input.innerText.split(', ').filter(Boolean), value].join(', ')
      : value;
    this.#input.innerText = computedValue;
    this.el.value = computedValue;

    updateInputs([this.#input]);
  }

  #unSelect(item: HTMLDivElement) {
    const value = (item as any).axValue;
    item.classList.remove('form-selected');

    let computedValue = '';
    if (this.el.multiple) {
      item.querySelector('input').checked = false;

      const values = this.#input.innerText.split(', ').filter(Boolean);
      const i = values.findIndex((v) => v === value);
      values.splice(i, 1);

      computedValue = values.join(', ');
    }

    this.#input.innerText = computedValue;
    this.el.value = computedValue;

    updateInputs([this.#input]);
  }
}

registerComponent({
  class: Select,
  name: 'Select',
  dataDetection: true,
  autoInit: {
    enabled: true,
    selector: '.form-custom-select',
  },
});
