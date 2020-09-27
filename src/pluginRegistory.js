
const createPluginRegistry = () => {

  const registerPlugin = (plugin) => {
    if(registry.find(element => element.name === plugin.name)) {
      return;
    }

    registry.push(plugin);
  };

  const dropPlugin = (pluginName) => {
    const index = registry.findIndex(element => element.name === pluginName);

    if(index === -1) {
      return;
    }

    registry.splice(index, 1);
  };

  const initialize = () => {
    const registry = [];

    return {
      registry
    }
  };

  const findHandlers = (hookType) => {
    return registry.filter((plugin) => {
      return plugin[hookType] && typeof plugin[hookType] === 'function';
    }).map(plugin => plugin[hookType]);
  }

  const { registry } = initialize();

  return {
    registerPlugin,
    dropPlugin,
    findHandlers
  };
};

export { createPluginRegistry };
