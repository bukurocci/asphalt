import { createProcess } from '../../src/';

const waitProcess = createProcess((handlers) => (timeout) => (payload) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  })
    .then(() => {
      return handlers.ok(payload.value);
    })
    .catch((e) => {
      return handlers.error(e);
    });
});

export { waitProcess };
