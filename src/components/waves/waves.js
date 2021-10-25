let i = 0;
const uid = () => ++i;
const isMobile = 'ontouchstart' in document.documentElement;

let wavesInstance = null;

const targetMap = {};
const itemMap = {};


const createWaveItem = (target) => {
  const id = uid();
  const el = document.createElement('div');
  const container = document.createElement('div');
  const tagName = target.tagName.toLowerCase();

  target.setAttribute('ax-waves-id', id);
  container.classList.add('ax-waves-item-inner');
  container.setAttribute('ax-waves-id', id);

  el.classList.add('ax-waves-box');
  el.setAttribute('ax-waves-id', id);

  el.appendChild(container);
  targetMap[id] = target;
  itemMap[id] = el;

  if (['img', 'video'].includes(tagName)) target.parentNode.appendChild(el);
  else target.appendChild(el);

  return el;
};


const createWaves = ({id, size, x, y, container, item, target}, color) => {
  const waves = document.createElement('span');

  let style = `height:${size}px;
           width:${size}px;
           left:${x}px;
           top:${y}px;`

  if (color) style += `background-color: ${color};`; 

  waves.setAttribute('ax-waves-id', id);
  waves.classList.add('ax-waves-item');
  waves.style = ('style', style);

  waves.addEventListener('animationend', () => {
    container.removeChild(waves);
    if (!container.children.length && item) {
      item.parentNode?.removeChild(item);
      target.removeAttribute('ax-waves-id');
      delete itemMap[id];
      delete targetMap[id];
    }
  }, { once: true });
  return waves;
};


const getWavesParams = (clientX, clientY, id, target) => {
  const {top, left, width, height} = target.getBoundingClientRect();
  const x = clientX - left;
  const y = clientY - top;
  let item = itemMap[id];

  if (!item) item = createWaveItem(target);
  id = item.getAttribute('ax-waves-id') || uid();

  const container = item.children[0];

  const size = (
    Math.max(left + width - clientX, clientX - left) ** 2
    + Math.max(top + height - clientY, clientY - top) ** 2
  ) ** 0.5 * 2;

  return {id, size, x, y, container, item, target};
};


const getContainerStyle = (target, item) => {
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


const getTarget = (el, id) => {
  const target = targetMap[id];
  
  if (target) return target;
  if (el.getAttribute('ax-waves') !== null) return el;

  return el.closest('[ax-waves]') || null;
};


const handler = (e) => {
  const el = e.target;
  const id = el.getAttribute('ax-waves-id') || '';
  const target = getTarget(el, id);
  
  if (!target || target.getAttribute('disabled')) return;
  const color = target.getAttribute('ax-waves');

  let { clientX, clientY } = e;
  if (isMobile) {
    const click = e.touches[0];
    clientX = click.clientX;
    clientY = click.clientY;
  }

  const wavesParams = getWavesParams(clientX, clientY, id, target);
  const waves = createWaves(wavesParams, color);
  const { container, item } = wavesParams;

  container.setAttribute('style', getContainerStyle(target, item));  
  container.appendChild(waves);
};


export class Waves {
  static run() {
    return new Waves();
  }

  static destroy() {
    return wavesInstance.destroy();
  }

  constructor() {
    if (wavesInstance) return wavesInstance;

    const docEl = document.documentElement;
    
    if ('animation' in docEl.style) {
      const eventType = isMobile ? 'touchstart' : 'mousedown';
      wavesInstance = this;

      window.addEventListener(eventType, handler);
    }
  }

  destroy() {
    const eventType = isMobile ? 'touchstart' : 'mousedown';
    window.removeEventListener(eventType, handler);
  }
}

document.addEventListener('DOMContentLoaded', () => Waves.run());
