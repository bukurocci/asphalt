import { ok, error } from './payload';

const createPlugin = (name, factory) => {
  return Object.assign({ name }, factory({ ok, error }));
};

export { createPlugin };
