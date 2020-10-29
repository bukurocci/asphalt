import { createPlugin } from '../../src';

const noopPlugin = createPlugin('noopPlugin', (handlers) => {
  return [
    'beforeEnter',
    'afterEnter',
    'beforeLeave',
    'afterLeave',
    'beforeErrorEnter',
    'afterErrorEnter',
    'beforeErrorLeave',
    'afterErrorLeave'
  ].reduce((hooks, hookType) => {
    hooks[hookType] = (payload) => {
      return payload.errors ? handlers.error(payload.value) : handlers.ok(payload.value);
    };

    return hooks;
  }, {});
});

export { noopPlugin };
