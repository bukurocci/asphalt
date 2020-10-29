import { noopPlugin } from './helper/noopPlugin';

const hooks = [
  'beforeEnter',
  'afterEnter',
  'beforeLeave',
  'afterLeave',
  'beforeErrorEnter',
  'afterErrorEnter',
  'beforeErrorLeave',
  'afterErrorLeave'
];

test('should return name', () => {
  expect(noopPlugin.name).toBe('noopPlugin');
});

test('should return hooks', () => {
  hooks.forEach((hookType) => {
    expect(noopPlugin[hookType]).toEqual(expect.any(Function));
  });
});
