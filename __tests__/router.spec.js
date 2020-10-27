import { createRouter } from '../src/router';
import { defineScene } from "../src/scene";

test('can find the route', () => {
  const router = createRouter();
  const sceneFactory = defineScene('test', {});

  router.route('/path/to/', sceneFactory);

  const { callback, params } = router.findMatched('/path/to/');

  expect(callback).toBe(sceneFactory);
  expect(params).toEqual({});
});

test('can find the route with parameter', () => {
  const router = createRouter();
  const sceneFactory = defineScene('test', {});

  router.route('/:path/:to/(index.html)?', sceneFactory);

  const matched1 = router.findMatched('/path/to/index.html');
  const matched2 = router.findMatched('/path/to/');

  expect(matched1.callback).toBe(sceneFactory);
  expect(matched1.params).toEqual({
    "0": "index.html",
    "path": "path",
    "to": "to"
  });

  expect(matched2.callback).toBe(sceneFactory);
  expect(matched2.params).toEqual({
    "path": "path",
    "to": "to"
  });
});

test('can find the route with regular expression', () => {
  const router = createRouter();
  const sceneFactory = defineScene('test', {});

  router.route('/path/(.*)/(\\w+)\\.(\\w+)', sceneFactory);

  const matched = router.findMatched('/path/to/index.html');

  expect(matched.callback).toBe(sceneFactory);
  expect(matched.params).toEqual({
    "0": "to",
    "1": "index",
    "2": "html"
  });
});

test('when router cannot find any routes', () => {
  const router = createRouter();
  const sceneFactory = defineScene('test', {});

  router.route('/path/to/index.html', sceneFactory);

  const matched = router.findMatched('/path2/to/index.html');

  expect(matched).toBeNull();
});


describe('when given the same routing path', () => {
  let warnSpy;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn');
    warnSpy.mockImplementation((x) => x);
  });

  afterEach(() => {
    warnSpy.mockReset()
    warnSpy.mockRestore();
  });

  test('should overwrite the scene if already registered routing path is given', () => {
    const router = createRouter();
    const sceneFactory1 = defineScene('test', {});
    const sceneFactory2 = defineScene('test2', {});

    router.route('/path/to/index.html', sceneFactory1);
    router.route('/path/to/index.html', sceneFactory2);

    const matched = router.findMatched('/path/to/index.html');

    expect(matched.callback).toBe(sceneFactory2);
  });

  test('should raise the warning if already registered routing path is given', () => {
    const warnSpy = jest.spyOn(console, 'warn');
    warnSpy.mockImplementation((x) => x);

    const router = createRouter();
    const sceneFactory1 = defineScene('test', {});
    const sceneFactory2 = defineScene('test2', {});
    const path = '/path/to/index.html'

    router.route(path, sceneFactory1);
    router.route(path, sceneFactory2);

    expect(warnSpy).toBeCalled();
    expect(warnSpy.mock.calls[0][0]).toBe(`[warning] overriden by the new callback function due to the path of '${path}' already registered`);
  });
});

test('can unroute the routing path', () => {
  const router = createRouter();
  const sceneFactory = defineScene('test', {});
  const routingPath = '/path/:to/(index.html)?';
  const path = '/path/to/index.html';

  router.route(routingPath, sceneFactory);

  // try to unroute an unknown path
  router.unroute('/path/to/unknown/index.html');

  const matched1 = router.findMatched(path);

  expect(matched1).not.toBeNull();

  // try to unroute the registered path
  router.unroute(routingPath);

  const matched2 = router.findMatched(path);

  expect(matched2).toBeNull();
});

test('when root option is given', () => {
  const router = createRouter({
    root: '/base/path/'
  });
  const sceneFactory = defineScene('test', {});

  router.route('/(.*)', sceneFactory);

  // other directory
  expect(router.findMatched('/to/')).toBeNull();

  // sibling file
  expect(router.findMatched('/base/path')).toBeNull();

  // descendant directory
  expect(router.findMatched('/base/path/to/')).not.toBeNull();

  // just root
  expect(router.findMatched('/base/path/')).not.toBeNull();
});
