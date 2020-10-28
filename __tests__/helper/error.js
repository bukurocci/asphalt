import { createProcess } from '../../src/createProcess';

const raiseErrorProcess = createProcess((handlers) => {
  return (payload) => {
    return handlers.error(new Error('the error raised by raiseErrorProcess'));
  };
});

export { raiseErrorProcess };
