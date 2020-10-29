import { createProcess } from '../src/createProcess';
import { ok, error } from '../src/result';
import { createPayloadFactory } from '../src';

test('should be passed ok and error handlers', () => {
  const callback = jest.fn((handlers) => {
    return (payload) => {
      return payload.errors ? handlers.error(payload.value) : handlers.ok(payload.value);
    };
  });
  const noopProcess = createProcess(callback);
  const payloadFactory = createPayloadFactory({});
  const okPayload = payloadFactory(ok({ value: 1 }));
  const errorPayload = payloadFactory(error(new Error('payload error')));

  const resultOK = noopProcess(okPayload);
  const resultError = noopProcess(errorPayload);

  expect(callback.mock.calls[0][0]).toEqual({ ok, error });
  expect(resultOK.isError).toBe(false);
  expect(resultOK.value).toEqual({
    value: 1
  });
  expect(resultError.isError).toBe(true);
  expect(resultError.value).toEqual(expect.any(Error));
});
