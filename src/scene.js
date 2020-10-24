const noopHook = () => [];
const defaultHooks = {
  enter: noopHook,
  errorEnter: noopHook,
  leave: noopHook,
  errorLeave: noopHook
};

const filterHooksFromOption = (options) => {
  const hookTypes = ['enter', 'errorEnter', 'leave', 'errorLeave'];

  return Object.keys(options)
    .filter((key) => hookTypes.includes(key))
    .reduce((hooks, hookType) => {
      if (typeof options[hookType] === 'function') {
        hooks[hookType] = options[hookType];
      }

      return hooks;
    }, {});
};

const defineScene = (name, options = {}) => {
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

    const errorEnter = (payload) => {
      return hooks.errorEnter(payload) || [];
    };

    const leave = (payload) => {
      return hooks.leave(payload) || [];
    };

    const errorLeave = (payload) => {
      return hooks.errorLeave(payload) || [];
    };

    return {
      get name() {
        return name;
      },
      enter,
      leave,
      errorEnter,
      errorLeave
    };
  };
};

export { defineScene };
