import { ok, error } from './result';

const createProcess = (process) => process({ ok, error });

export { createProcess };
