import { ok, error } from './result';

const createPlugin = (name, factory) => {
  return Object.assign({ name }, factory({ ok, error }));
};

export { createPlugin };
