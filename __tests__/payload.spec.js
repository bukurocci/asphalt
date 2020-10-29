import { createPayloadFactory } from '../src/payload';
import { error, ok } from '../src/result';

test('OK payload', () => {
  const context = {
    value: 1
  };
  const factory = createPayloadFactory(context);
  const okPayload = factory(ok({}));

  expect(okPayload.errors).toBe(false);
  expect(okPayload.value).toEqual({});
  expect(okPayload.routingContext).toEqual({ value: 1 });
});

test('Error payload', () => {
  const context = {
    value: 1
  };
  const factory = createPayloadFactory(context);
  const e = new Error('payload error');
  const errorPayload = factory(error(e));

  expect(errorPayload.errors).toBe(true);
  expect(errorPayload.value).toEqual(e);
  expect(errorPayload.routingContext).toEqual({ value: 1 });
});
