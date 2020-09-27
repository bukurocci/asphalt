import { ok, error } from './payload';

const createProcess = (process) => process({ ok, error });

export { createProcess }
