import { defineScene } from '../src/scene';

test('should return scene name', () => {
  const scene = defineScene('test', {});

  expect(scene().name).toBe('test');
});

describe('enter hook', () => {
  const hook1 = () => {};
  const hook2 = () => {};

  test('should return an array of passed hook function', () => {
    const sceneFactory = defineScene('test', {
      enter() {
        return [hook1, hook2];
      }
    });

    const scene = sceneFactory();

    // enter()
    expect(scene.enter()).toEqual([hook1, hook2]);
  });

  test("should return an empty array if it doesn't be passd enter() method", () => {
    const sceneFactory = defineScene('test', {});

    const scene = sceneFactory();

    expect(scene.enter()).toEqual([]);
  });
});

describe('leave hook', () => {
  const hook1 = () => {};
  const hook2 = () => {};

  test('should return an array of passed hook function', () => {
    const sceneFactory = defineScene('test', {
      leave() {
        return [hook1, hook2];
      }
    });

    const scene = sceneFactory();

    expect(scene.leave()).toEqual([hook1, hook2]);
  });

  test("should return an empty array if it doesn't be passd leave() method", () => {
    const sceneFactory = defineScene('test', {});
    const scene = sceneFactory();

    expect(scene.leave()).toEqual([]);
  });
});

describe('errorEnter hook', () => {
  const hook1 = () => {};
  const hook2 = () => {};

  test('should return an array of passed hook function', () => {
    const sceneFactory = defineScene('test', {
      errorEnter() {
        return [hook1, hook2];
      }
    });

    const scene = sceneFactory();

    expect(scene.errorEnter()).toEqual([hook1, hook2]);
  });

  test("should return an empty array if it doesn't be passd errorEnter() method", () => {
    const sceneFactory = defineScene('test', {});
    const scene = sceneFactory();

    expect(scene.errorEnter()).toEqual([]);
  });
});

describe('errorLeave hook', () => {
  const hook1 = () => {};
  const hook2 = () => {};

  test('should return an array of passed hook function', () => {
    const sceneFactory = defineScene('test', {
      errorLeave() {
        return [hook1, hook2];
      }
    });

    const scene = sceneFactory();

    expect(scene.errorLeave()).toEqual([hook1, hook2]);
  });

  test("should return an empty array if it doesn't be passd errorLeave() method", () => {
    const sceneFactory = defineScene('test', {});
    const scene = sceneFactory();

    expect(scene.errorLeave()).toEqual([]);
  });
});
