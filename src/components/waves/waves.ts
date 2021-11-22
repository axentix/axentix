import { isTouchEnabled, isPointerEnabled, getUid } from "../../utils/utilities";
import { config, getCssVar } from '../../utils/config'

const prefix = config.prefix;
const isMobile: boolean = isTouchEnabled();
const targetMap = {};
const itemMap = {};

interface WavesParams {
  id: string,
  size: number,
  x: number,
  y: number,
  container: HTMLElement,
  item: HTMLElement,
  target: HTMLElement
}

const createWaveItem = (target: HTMLElement) => {
  const id: string = getUid();
  const el: HTMLElement = document.createElement('div');
  const container: HTMLElement = document.createElement('div');
  const tagName: string = target.tagName.toLowerCase();

  target.setAttribute(`${prefix}-waves-id`, id);
  container.classList.add(`${prefix}-waves-item-inner`);
  container.setAttribute(`${prefix}-waves-id`, id);

  el.classList.add(`${prefix}-waves-box`);
  el.setAttribute(`${prefix}-waves-id`, id);

  el.appendChild(container);
  targetMap[id] = target;
  itemMap[id] = el;

  if (['img', 'video'].includes(tagName)) target.parentNode.appendChild(el);
  else target.appendChild(el);

  return el;
};

const createWaves = ({id, size, x, y, container, item, target}: WavesParams, color: string) => {
  const waves = document.createElement('span');

  let style = `height:${size}px;
           width:${size}px;
           left:${x}px;
           top:${y}px;`
 
  if (color) style += `${getCssVar('waves-color')}: ${color}`;

  waves.setAttribute(`${prefix}-waves-id`, id);
  waves.classList.add(`${prefix}-waves-item`);
  waves.setAttribute('style', style);
  

  waves.addEventListener('animationend', () => {
    container.removeChild(waves);
    if (!container.children.length && item) {
      if (item.parentNode) item.parentNode.removeChild(item);

      target.removeAttribute(`${prefix}-waves-id`);
      delete itemMap[id];
      delete targetMap[id];
    }
  }, { once: true });
  return waves;
};

const getWavesParams = (clientX: number, clientY: number, id: string, target: HTMLElement): WavesParams => {
  const {top, left, width, height} = target.getBoundingClientRect();
  const x: number = clientX - left;
  const y: number = clientY - top;
  let item: any = itemMap[id];

  if (!item) item = createWaveItem(target);
  id = item.getAttribute(`${prefix}-waves-id`) || getUid();

  const container: HTMLElement = item.children[0];

  const size: number = (
    Math.max(left + width - clientX, clientX - left) ** 2
    + Math.max(top + height - clientY, clientY - top) ** 2
  ) ** 0.5 * 2;

  return {id, size, x, y, container, item, target};
};


const getContainerStyle = (target: HTMLElement, item: HTMLElement): string => {
  const {left, top, width, height} = target.getBoundingClientRect();
  const {left: itemLeft, top: itemTop} = item.getBoundingClientRect();
  const {borderRadius, zIndex} = window.getComputedStyle(target);
  
  return `left:${left - itemLeft}px;
          top:${top - itemTop}px;
          height:${height}px;
          width:${width}px;
          border-radius:${borderRadius || '0'};
          z-index:${zIndex};`;
};

const getTarget = (el: HTMLElement, id: string) => {
  const target = targetMap[id];
  
  if (target) return target;
  if (el.getAttribute(`${prefix}-waves`) !== null) return el;

  return el.closest(`[${prefix}-waves]`) || null;
};

const handler = (e) => {
  const el = e.target;
  const id = el.getAttribute(`${prefix}-waves-id`) || '';
  const target = getTarget(el, id);
  
  if (!target || target.getAttribute('disabled')) return;
  const color = target.getAttribute(`${prefix}-waves`);

  let { clientX, clientY } = e;
  if (isMobile) {
    const click = e.touches[0];
    clientX = click.clientX;
    clientY = click.clientY;
  }

  const params: WavesParams = getWavesParams(clientX, clientY, id, target);
  const waves = createWaves(params, color);
  const { container, item } = params;
  
  container.setAttribute('style', getContainerStyle(target, item));
  container.appendChild(waves);
};

export const Waves = () => {
  const isPointer = isPointerEnabled();

  let pointerType = 'mouse';
  if (isMobile) pointerType = 'touch';
  else if (isPointer) pointerType = 'pointer';

  const eventType = `${pointerType}${isMobile ? 'start' : 'down'}`;
  window.addEventListener(eventType, handler);
}

document.addEventListener('DOMContentLoaded', () => Waves());
