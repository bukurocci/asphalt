const noopHook = () => [];
const defaultHooks = {
  enter: noopHook,
  leave: noopHook,
  error: noopHook
};

const filterHooksFromOption = (options) => {
  const hookTypes = ['enter', 'leave', 'error'];

  return Object.keys(options)
    .filter(key => hookTypes.includes(key))
    .reduce((hooks, hookType) => {
      if(typeof options[hookType] === 'function') {
        hooks[hookType] = options[hookType];
      }

      return hooks;
    }, {});
};

const defineScene = (options = {}) => {

  const initialize = () => {
    const hooks = Object.assign({}, defaultHooks, filterHooksFromOption(options));

    return {
      hooks
    };
  };

  const { hooks } = initialize();

  return () => {

    const enter = (payload) => {
      return hooks.enter(payload) || [];
    };

    const leave = (payload) => {
      return hooks.leave(payload) || [];
    };

    const error = (payload) => {
      return hooks.error(payload) || [];
    };

    return {
      enter,
      leave,
      error
    }
  };
};


export { defineScene };
