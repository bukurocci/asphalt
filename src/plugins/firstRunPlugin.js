import { createPlugin } from '../createPlugin';


const firstRunPlugin = createPlugin('firstRunPlugin', ({ ok, error }) => {

  const beforeEnter = (payload) => {
    const { errors, value } = payload;

    const newValue = Object.assign({}, value, {
      firstRun: state.firstRun
    });

    return errors ? error(newValue) : ok(newValue);
  };

  const beforeLeave = (payload) => {
    const { errors, value } = payload;

    if (state.firstRun) {
      state.firstRun = false;
    }

    const newValue = Object.assign({}, value, {
      firstRun: state.firstRun
    });

    return errors ? error(newValue) : ok(newValue);
  };

  const initialize = () => {
    const firstRun = true;

    return {
      state: {
        firstRun
      }
    }
  };

  const { state } = initialize();

  return {
    beforeEnter,
    beforeLeave
  }
});

export { firstRunPlugin }