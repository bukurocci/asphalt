import { createPluginRegistry } from '../src/pluginRegistory';
import { logPlugin } from './helper/logPlugin';
import { noopPlugin } from './helper/noopPlugin';

const pluginHooks = [
  'beforeEnter',
  'afterEnter',
  'beforeLeave',
  'afterLeave',
  'beforeErrorEnter',
  'afterErrorEnter',
  'beforeErrorLeave',
  'afterErrorLeave'
];

test('can register an plugin', () => {
  const pluginRegistry = createPluginRegistry();
  pluginRegistry.registerPlugin(logPlugin);

  pluginHooks.forEach((hookType) => {
    const process = logPlugin[hookType];
    expect(pluginRegistry.findProcesses(hookType)).toEqual([process]);
  });
});

test('can drop an specified plugin by name', () => {
  const pluginRegistry = createPluginRegistry();
  pluginRegistry.registerPlugin(noopPlugin);
  pluginRegistry.registerPlugin(logPlugin);
  pluginRegistry.dropPlugin(logPlugin.name);

  pluginHooks.forEach((hookType) => {
    expect(pluginRegistry.findProcesses(hookType)).toEqual([noopPlugin[hookType]]);
  });
});

test('respect the order in which you specified', () => {
  const pluginRegistry = createPluginRegistry();
  pluginRegistry.registerPlugin(noopPlugin);
  pluginRegistry.registerPlugin(logPlugin);

  pluginHooks.forEach((hookType) => {
    expect(pluginRegistry.findProcesses(hookType)).toEqual([noopPlugin[hookType], logPlugin[hookType]]);
  });
});
