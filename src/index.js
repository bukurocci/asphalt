import elementClosestPolyfill from 'element-closest';

elementClosestPolyfill(window);

export { createContext } from './context';
export { defineScene } from './scene';
export { createPlugin } from './createPlugin';
export { createProcess } from './createProcess';
export { fetchHTMLProcess } from './process';
export { pushStatePlugin, firstRunPlugin } from './plugins';
