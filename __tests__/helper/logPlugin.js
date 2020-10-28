import { createPlugin } from '../../src';

const logPlugin = createPlugin('logPlugin', (handlers) => {
  const beforeEnter = (payload) => {
    const result = payload.errors ? handlers.error(payload.value) : handlers.ok(payload.value);
    const name = payload.routingContext.name;

    console.info(`heading to ${name}: beforeEnter called`);
    return result;
  };

  const afterEnter = (payload) => {
    const result = payload.errors ? handlers.error(payload.value) : handlers.ok(payload.value);
    const name = payload.routingContext.name;

    console.info(`heading to ${name}: afterEnter called`);
    return result;
  };

  const beforeLeave = (payload) => {
    const result = payload.errors ? handlers.error(payload.value) : handlers.ok(payload.value);
    const name = payload.routingContext.name;

    console.info(`heading to ${name}: beforeLeave called`);
    return result;
  };

  const afterLeave = (payload) => {
    const result = payload.errors ? handlers.error(payload.value) : handlers.ok(payload.value);
    const name = payload.routingContext.name;

    console.info(`heading to ${name}: afterLeave called`);
    return result;
  };

  const beforeErrorEnter = (payload) => {
    const result = payload.errors ? handlers.error(payload.value) : handlers.ok(payload.value);
    const name = payload.routingContext.name;

    console.info(`heading to ${name}: beforeErrorEnter called`);
    return result;
  };

  const afterErrorEnter = (payload) => {
    const result = payload.errors ? handlers.error(payload.value) : handlers.ok(payload.value);
    const name = payload.routingContext.name;

    console.info(`heading to ${name}: afterErrorEnter called`);
    return result;
  };

  const beforeErrorLeave = (payload) => {
    const result = payload.errors ? handlers.error(payload.value) : handlers.ok(payload.value);
    const name = payload.routingContext.name;

    console.info(`heading to ${name}: beforeErrorLeave called`);
    return result;
  };

  const afterErrorLeave = (payload) => {
    const result = payload.errors ? handlers.error(payload.value) : handlers.ok(payload.value);
    const name = payload.routingContext.name;

    console.info(`heading to ${name}: afterErrorLeave called`);
    return result;
  };

  return {
    beforeEnter,
    afterEnter,
    beforeLeave,
    afterLeave,
    beforeErrorEnter,
    afterErrorEnter,
    beforeErrorLeave,
    afterErrorLeave
  };
});

export { logPlugin };
