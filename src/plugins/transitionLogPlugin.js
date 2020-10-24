import { createPlugin } from '../createPlugin';

const transitionLogPlugin = createPlugin('transitionLogPlugin', (handler) => {
  const beforeEnter = (payload) => {
    const name = payload.routingContext.name;

    console.info(`Asphalt: [INFO] start entering ${name} scene`);

    return payload.errors ? handler.error(payload.value) : handler.ok(payload.value);
  };

  const afterEnter = (payload) => {
    const name = payload.routingContext.name;

    console.info(`Asphalt: [INFO] finish entering ${name} scene`);

    context.name = name;

    return payload.errors ? handler.error(payload.value) : handler.ok(payload.value);
  };

  const beforeLeave = (payload) => {
    console.info(`Asphalt: [INFO] start leaving ${context.name} scene`);

    return payload.errors ? handler.error(payload.value) : handler.ok(payload.value);
  };

  const afterLeave = (payload) => {
    console.info(`Asphalt: [INFO] finish leaving ${context.name} scene`);

    return payload.errors ? handler.error(payload.value) : handler.ok(payload.value);
  };

  const initialize = () => {
    const name = '';

    return {
      name
    };
  };

  const context = initialize();

  return {
    beforeEnter,
    afterEnter,
    beforeLeave,
    afterLeave
  };
});

export { transitionLogPlugin };
