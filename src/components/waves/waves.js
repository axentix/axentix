let id = 0;
const uid = () => ++id;
const isMobile = 'ontouchstart' in document.documentElement;

let wavesInstance = null;

const targetMap = {};
const boxMap = {};


const createItemBox = (target) => {
  const id = uid();
  const el = document.createElement('div');
  const container = document.createElement('div');
  const tagName = target.tagName.toLowerCase();

  target.setAttribute('ax-waves-id', id);
  container.setAttribute('ax-waves-item-box-inner', '');
  container.setAttribute('ax-waves-id', id);
  el.setAttribute('ax-waves-item-box', '');
  el.setAttribute('ax-waves-id', id);

  el.appendChild(container);
  targetMap[id] = target;
  boxMap[id] = el;

  if (['img', 'video'].includes(tagName)) target.parentNode.appendChild(el);
  else target.appendChild(el);

  return el;
};


const createWaves = ({id, size, x, y, container, box, target}) => {
  const waves = document.createElement('span');

  waves.setAttribute('ax-waves-id', uid());
  waves.setAttribute('ax-waves-item', '');
  waves.setAttribute('style', `height:${size}px;
                               width:${size}px;
                               left:${x}px;
                               top:${y}px;`);

  waves.addEventListener('animationend', () => {
    container.removeChild(waves);
    if (!container.children.length && box) {
      box.parentNode?.removeChild(box);
      target.removeAttribute('ax-waves-id');
      delete boxMap[id];
      delete targetMap[id];
    }
  }, { once: true });
  return waves;
};


const getWavesParams = (clientX, clientY, id, target) => {
  const {top, left, width, height} = target.getBoundingClientRect();
  const x = clientX - left;
  const y = clientY - top;

  let box = boxMap[id];

  if (!box) box = createItemBox(target);

  id = box.getAttribute('ax-waves-id') || uid();

  const container = box.children[0];

  const size = (
    Math.max(left + width - clientX, clientX - left) ** 2
    + Math.max(top + height - clientY, clientY - top) ** 2
  ) ** 0.5 * 2;

  return {id, size, x, y, container, box, target};
};


const getContainerStyle = (target, itemBox) => {
  const {left, top, width, height} = target.getBoundingClientRect();
  const {left: boxLeft, top: boxTop} = itemBox.getBoundingClientRect();
  const {borderRadius, zIndex} = window.getComputedStyle(target);
  
  return `left:${left - boxLeft}px;
          top:${top - boxTop}px;
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
  if (!isMobile && e.button !== 0) return;
  const el = e.target;
  const id = el.getAttribute('ax-waves-id') || '';
  const target = getTarget(el, id);
  console.log(target);
  
  if (!target || target.getAttribute('disabled')) return;
  
  let { clientX, clientY } = e;
  if (isMobile) {
    const item = e.touches[0];
    clientX = item.clientX;
    clientY = item.clientY;
  }

  const wavesParams = getWavesParams(clientX, clientY, id, target);
  const waves = createWaves(wavesParams);
  const { container, box } = wavesParams;
  const type = isMobile ? 'touchend' : 'mouseup';

  target.setAttribute('ax-waves-active', '');
  window.addEventListener(type, (event) => {
    if (isMobile) {
      event.preventDefault();
      const clickEvent = new Event('click', { "bubbles": true, "cancelable": true});
      target.dispatchEvent(clickEvent);
    }
    target.removeAttribute('ax-waves-active');
  }, { once: true });

  container.setAttribute('style', getContainerStyle(target, box));
  
  container.appendChild(waves);
};


export class Waves {
  mainColor;

  static run(mainColor) {
    return new Waves(mainColor);
  }

  static destroy() {
    return wavesInstance.destroy();
  }

  constructor(mainColor) {
    if (wavesInstance) return wavesInstance;

    const docEl = document.documentElement;
    
    if ('animation' in docEl.style) {
      const eventType = isMobile ? 'touchstart' : 'mousedown';
      this.mainColor = mainColor;
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
