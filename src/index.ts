// Core CSS
import './core.scss';

// CSS Only Components
import './components/grix';
import './components/layouts';
import './components/button';
import './components/button-group';
import './components/card';
import './components/footer';
import './components/navbar';
import './components/pagination';
import './components/table';
import './components/loading';
import './components/utilities';
import './components/trends';

// JS Components
export { default as Caroulix } from './components/caroulix/index';
export { default as Collapsible } from './components/collapsible/index';
export { default as Sidenav } from './components/sidenav/index';
export { default as Dropdown } from './components/dropdown/index';
export { default as Fab } from './components/fab/index';
export { default as Lightbox } from './components/lightbox/index';
export { default as Modal } from './components/modal/index';
export { default as Tab } from './components/tab/index';
export { default as ScrollSpy } from './components/scrollspy/index';
export { default as Toast } from './components/toast/index';
export { default as Tooltip } from './components/tooltip/index';
export { default as Waves } from './components/waves/index';
export { Forms } from './components/forms/index';
export { Select } from './components/forms/select';

// Must be loaded at the end
import './core/_colors.scss';

// JS Utils
export * from './utils/config';
export * from './utils/core';
export * from './utils/utilities';
