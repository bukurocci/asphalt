import elementClosestPolyfill from 'element-closest';

elementClosestPolyfill(window);

export { createContext } from './context';
export { defineScene } from './scene';
export { createPlugin } from './createPlugin';
export { createProcess } from './createProcess';
export { createEmptyPayload, createPayloadFactory } from './payload';
export { ok, error } from './result';
export { fetchHTMLProcess } from './process';
export { pushStatePlugin, firstRunPlugin, transitionLogPlugin } from './plugins';
