import { wrap, unwrap, getUid } from '../../utils/utilities';
import { Dropdown } from '../dropdown/dropdown';

export class Select {
  el: HTMLSelectElement;

  #dropdownInstance: Dropdown;
  #container: HTMLDivElement;
  #input: HTMLInputElement;

  constructor(select: HTMLSelectElement) {
    this.el = select;
    this.setup();
  }

  setup() {
    this.el.style.display = 'none';
    this.#container = wrap([this.el]);
    this.#container.className = 'form-custom-select';
    this.el.classList.remove('form-custom-select');

    this.#setupDropdown();
  }

  destroy() {
    this.#dropdownInstance.destroy();
    this.#dropdownInstance.el.remove();
    this.#dropdownInstance = null;

    unwrap(this.#container);
    this.el.classList.add('form-custom-select');
  }

  #setupDropdown() {
    const dropdown = document.createElement('div');
    const uid = `dropdown-${getUid()}`;
    dropdown.className = 'dropdown';
    dropdown.id = uid;

    this.#input = document.createElement('input');
    this.#input.type = 'text';
    this.#input.className = 'form-control';
    this.#input.readOnly = true;
    this.#input.disabled = this.el.disabled;
    this.#input.dataset.target = uid;

    const dropdownContent = document.createElement('div');
    const classes = this.el.className.replace('form-control', '');
    dropdownContent.className = `dropdown-content ${classes}`;

    this.#setupContent(dropdownContent);

    Array.from(this.el.attributes).forEach((a) => {
      if (a.name.startsWith('data-dropdown')) dropdown.setAttribute(a.name, a.value);
    });
    dropdown.appendChild(this.#input);
    dropdown.appendChild(dropdownContent);

    this.#container.appendChild(dropdown);

    this.#dropdownInstance = new Dropdown(`#${uid}`);
  }

  #createCheckbox() {
    const formField = document.createElement('div');
    formField.className = 'form-field';

    const label = document.createElement('label');
    label.className = 'form-check';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    label.appendChild(checkbox);
    formField.appendChild(label);

    return formField;
  }

  #setupContent(dropdownContent: HTMLDivElement) {
    for (const option of this.el.options) {
      const item = document.createElement('div');
      item.className = 'dropdown-item';
      item.innerHTML = this.el.multiple ? this.#createCheckbox().innerHTML + option.text : option.text;
      (item as any).axValue = option.value || option.text;

      (item as any).axClickRef = this.#onClick.bind(this, item);
      item.addEventListener('click', (item as any).axClickRef);

      dropdownContent.appendChild(item);
    }
  }

  #onClick(item: any) {
    if (!item.classList.contains('form-selected')) this.#select(item);
    else this.#unSelect(item);
  }

  #select(item: HTMLDivElement) {
    const value = (item as any).axValue;
    item.classList.add('form-selected');

    if (this.el.multiple) item.querySelector('input').checked = true;

    const computedValue = this.el.multiple
      ? [...this.#input.value.split(', ').filter(Boolean), value].join(', ')
      : value;
    this.#input.value = computedValue;
    this.el.value = computedValue;
  }

  #unSelect(item: HTMLDivElement) {
    const value = (item as any).axValue;
    item.classList.remove('form-selected');

    let computedValue = value;
    if (this.el.multiple) {
      item.querySelector('input').checked = false;

      const values = this.#input.value.split(', ').filter(Boolean);
      const i = values.findIndex((v) => v === value);
      values.splice(i, 1);

      computedValue = values.join(', ');
    }

    this.#input.value = computedValue;
    this.el.value = computedValue;
  }
}

let selectRefs = [];
document.addEventListener('DOMContentLoaded', () => {
  const selects = document.querySelectorAll('.form-custom-select');
  if (selects.length === 0) return;

  selects.forEach((s: HTMLSelectElement) => selectRefs.push(new Select(s)));
});

export const destroyAllSelects = () => {
  selectRefs.forEach((s) => s.destroy());
  selectRefs = [];
};
