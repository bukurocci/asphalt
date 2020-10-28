import { createProcess } from '../../src';

const logProcess = createProcess((handlers) => (message) => (payload) => {
  const result = payload.errors ? handlers.error(payload.value) : handlers.ok(payload.value);
  const name = payload.routingContext.name;

  console.info(`heading to ${name}: ${message}`);

  return result;
});

export { logProcess };
