import { createScheduler } from '../src/scheduler';
import { defineScene } from '../src/scene';
import { createPluginRegistry } from '../src/pluginRegistory';
import { waitProcess } from './helper/wait';
import { logPlugin } from './helper/logPlugin';
import { logProcess } from './helper/log';
import { raiseErrorProcess } from './helper/error';

let infoSpy = null;

beforeEach(() => {
  infoSpy = jest.spyOn(console, 'info').mockImplementation((x) => x);
});

afterEach(() => {
  infoSpy.mockReset();
  infoSpy.mockRestore();
});

test('busy', (done) => {
  const sceneFactory = defineScene('test1', {
    enter() {
      return [waitProcess(500)];
    }
  });
  const scene = sceneFactory();
  const plugins = createPluginRegistry();

  const scheduler = createScheduler();

  expect(scheduler.busy).toBe(false);

  scheduler.exec(scene, plugins, {}).then(() => {
    expect(scheduler.busy).toBe(false);
    done();
  });

  expect(scheduler.busy).toBe(true);
});

test('should call in that order beforeEnter => enter => afterEnter on the first run', async () => {
  const plugins = createPluginRegistry();
  plugins.registerPlugin(logPlugin);

  const sceneFactory = defineScene('test1', {
    enter() {
      return [logProcess('enter called')];
    }
  });
  const scene = sceneFactory();

  const scheduler = createScheduler();

  await scheduler.exec(scene, plugins, { name: scene.name });

  expect(infoSpy).toHaveBeenCalledTimes(3);
  expect(infoSpy.mock.calls[0][0]).toBe('heading to test1: beforeEnter called');
  expect(infoSpy.mock.calls[1][0]).toBe('heading to test1: enter called');
  expect(infoSpy.mock.calls[2][0]).toBe('heading to test1: afterEnter called');
});

test('should call in that order beforeLeave => leave => afterLeave => beforeEnter => enter => afterEnter from the second run', async () => {
  const plugins = createPluginRegistry();
  plugins.registerPlugin(logPlugin);

  const scene1Factory = defineScene('test1', {
    enter() {
      return [logProcess('enter called')];
    },
    leave() {
      return [logProcess('leave called')];
    }
  });
  const scene2Factory = defineScene('test2', {
    enter() {
      return [logProcess('enter called')];
    },
    leave() {
      return [logProcess('leave called')];
    }
  });
  const scene1 = scene1Factory();
  const scene2 = scene2Factory();

  const scheduler = createScheduler();

  await scheduler.exec(scene1, plugins, { name: scene1.name });
  await scheduler.exec(scene2, plugins, { name: scene2.name });

  expect(infoSpy).toHaveBeenCalledTimes(9);
  expect(infoSpy.mock.calls[0][0]).toBe(`heading to ${scene1.name}: beforeEnter called`);
  expect(infoSpy.mock.calls[1][0]).toBe(`heading to ${scene1.name}: enter called`);
  expect(infoSpy.mock.calls[2][0]).toBe(`heading to ${scene1.name}: afterEnter called`);
  expect(infoSpy.mock.calls[3][0]).toBe(`heading to ${scene1.name}: beforeLeave called`);
  expect(infoSpy.mock.calls[4][0]).toBe(`heading to ${scene2.name}: leave called`);
  expect(infoSpy.mock.calls[5][0]).toBe(`heading to ${scene2.name}: afterLeave called`);
  expect(infoSpy.mock.calls[6][0]).toBe(`heading to ${scene2.name}: beforeEnter called`);
  expect(infoSpy.mock.calls[7][0]).toBe(`heading to ${scene2.name}: enter called`);
  expect(infoSpy.mock.calls[8][0]).toBe(`heading to ${scene2.name}: afterEnter called`);
});

test('should call the errorEnter hook if an error remains when complete the afterEnter hook', async () => {
  const plugins = createPluginRegistry();
  plugins.registerPlugin(logPlugin);

  const sceneFactory = defineScene('test1', {
    enter() {
      return [raiseErrorProcess, logProcess('enter called')];
    },
    errorEnter() {
      return [logProcess('errorEnter called')];
    }
  });
  const scene = sceneFactory();

  const scheduler = createScheduler();

  await scheduler.exec(scene, plugins, { name: scene.name });

  expect(infoSpy).toHaveBeenCalledTimes(6);
  expect(infoSpy.mock.calls[0][0]).toBe(`heading to ${scene.name}: beforeEnter called`);
  expect(infoSpy.mock.calls[1][0]).toBe(`heading to ${scene.name}: enter called`);
  expect(infoSpy.mock.calls[2][0]).toBe(`heading to ${scene.name}: afterEnter called`);
  expect(infoSpy.mock.calls[3][0]).toBe(`heading to ${scene.name}: beforeErrorEnter called`);
  expect(infoSpy.mock.calls[4][0]).toBe(`heading to ${scene.name}: errorEnter called`);
  expect(infoSpy.mock.calls[5][0]).toBe(`heading to ${scene.name}: afterErrorEnter called`);
});

test('should call the errorLeave if an error remains when complete the afterLeave', async () => {
  const plugins = createPluginRegistry();
  plugins.registerPlugin(logPlugin);

  const scene1Factory = defineScene('test1', {
    enter() {
      return [logProcess('enter called')];
    },
    leave() {
      return [raiseErrorProcess, logProcess('leave called')];
    },
    errorLeave() {
      return [logProcess('errorLeave called')];
    }
  });
  const scene2Factory = defineScene('test2', {
    enter() {
      return [logProcess('enter called')];
    },
    leave() {
      return [logProcess('leave called')];
    }
  });
  const scene1 = scene1Factory();
  const scene2 = scene2Factory();

  const scheduler = createScheduler();

  await scheduler.exec(scene1, plugins, { name: scene1.name });
  await scheduler.exec(scene2, plugins, { name: scene2.name });

  expect(infoSpy).toHaveBeenCalledTimes(12);
  expect(infoSpy.mock.calls[0][0]).toBe(`heading to ${scene1.name}: beforeEnter called`);
  expect(infoSpy.mock.calls[1][0]).toBe(`heading to ${scene1.name}: enter called`);
  expect(infoSpy.mock.calls[2][0]).toBe(`heading to ${scene1.name}: afterEnter called`);
  expect(infoSpy.mock.calls[3][0]).toBe(`heading to ${scene1.name}: beforeLeave called`);
  expect(infoSpy.mock.calls[4][0]).toBe(`heading to ${scene2.name}: leave called`);
  expect(infoSpy.mock.calls[5][0]).toBe(`heading to ${scene2.name}: afterLeave called`);
  expect(infoSpy.mock.calls[6][0]).toBe(`heading to ${scene2.name}: beforeErrorLeave called`);
  expect(infoSpy.mock.calls[7][0]).toBe(`heading to ${scene2.name}: errorLeave called`);
  expect(infoSpy.mock.calls[8][0]).toBe(`heading to ${scene2.name}: afterErrorLeave called`);
  expect(infoSpy.mock.calls[9][0]).toBe(`heading to ${scene2.name}: beforeEnter called`);
  expect(infoSpy.mock.calls[10][0]).toBe(`heading to ${scene2.name}: enter called`);
  expect(infoSpy.mock.calls[11][0]).toBe(`heading to ${scene2.name}: afterEnter called`);
});
