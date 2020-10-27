import { ok, error } from '../src/result';

test('ok', () => {
  const value = {
    value: 1
  };

  const resultOK = ok(value);

  expect(resultOK.isOk).toBe(true);
  expect(resultOK.isError).toBe(false);
  expect(resultOK.value).toEqual({
    value: 1
  });
});

test('error', () => {
  const value = new Error('error raised');

  const resultError = error(value);

  expect(resultError.isOk).toBe(false);
  expect(resultError.isError).toBe(true);
  expect(resultError.value).toBe(value);
});
