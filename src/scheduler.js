import { createEmptyPayload, createPayloadFactory } from './payload';
import { ok } from './result';

const noopHooks = {
  beforeEnter() {},
  enter() {},
  afterEnter() {},
  beforeLeave() {},
  leave() {},
  afterLeave() {},
  beforeErrorLeave() {},
  errorLeave() {},
  afterErrorLeave() {},
  beforeErrorEnter() {},
  errorEnter() {},
  afterEnterError() {}
};

const createScheduler = (options) => {

  const resolveHook = async(hookType, processes, payload = createEmptyPayload(), routingContext = {}) => {
    if (processes.length === 0) {
      return payload;
    }

    const payloadFactory = createPayloadFactory(routingContext);

    for (let i = 0; i < processes.length; i++) {
      const process = processes[i];
      payload = payloadFactory(await process(payload), payload.session);
    }

    return payload;
  };

  const exec = async(scene, plugins, routingContext = {}) => {
    if (state.busy) {
      return;
    }

    state.busy = true;

    const payloadFactory = createPayloadFactory(routingContext);
    const departed = state.currentScene;
    const destined = scene;

    if (departed) {
      state.payload = Object.assign({}, state.payload, await resolveHook('beforeLeave', plugins.findProcesses('beforeLeave'), state.payload, routingContext));
      state.payload = Object.assign({}, state.payload, await resolveHook('leave', departed.leave(state.payload), state.payload, routingContext));
      state.payload = Object.assign({}, state.payload, await resolveHook('afterLeave', plugins.findProcesses('afterLeave'), state.payload, routingContext));

      // 退出処理が完了した時にエラーが残っていたら異常系のトランジションを行う
      if (state.payload.error) {
        state.payload = Object.assign({}, state.payload, await resolveHook('beforeErrorLeave', plugins.findProcesses('beforeErrorLeave'), state.payload, routingContext));
        state.payload = Object.assign({}, state.payload, await resolveHook('errorLeave', departed.errorLeave(state.payload), state.payload, routingContext));
        state.payload = Object.assign({}, state.payload, await resolveHook('afterErrorLeave', plugins.findProcesses('afterErrorLeave'), state.payload, routingContext));
      }
    }

    state.payload = Object.assign({}, state.payload, await resolveHook('beforeEnter', plugins.findProcesses('beforeEnter'), payloadFactory(ok(Object.assign({}, state.payload.value))), routingContext));
    state.payload = Object.assign({}, state.payload, await resolveHook('enter', destined.enter(state.payload), state.payload, routingContext));
    state.payload = Object.assign({}, state.payload, await resolveHook('afterEnter', plugins.findProcesses('afterEnter'), state.payload, routingContext));

    // 入場処理が完了した時にエラーが残っていたら異常系のトランジションを行う
    if (state.payload.error) {
      state.payload = Object.assign({}, state.payload, await resolveHook('beforeErrorEnter', plugins.findProcesses('beforeEnterError'), state.payload, routingContext));
      state.payload = Object.assign({}, state.payload, await resolveHook('errorEnter', departed.errorEnter(state.payload), state.payload, routingContext));
      state.payload = Object.assign({}, state.payload, await resolveHook('afterErrorEnter', plugins.findProcesses('afterErrorEnter'), state.payload, routingContext));
    }

    state.currentScene = destined;
    state.busy = false;
  };

  const initialize = (options = {}) => {
    const currentScene = null;
    const hooks = Object.assign({}, noopHooks, options.hooks);
    const busy = false;
    const payload = createEmptyPayload();

    return {
      hooks,
      state: {
        payload,
        busy,
        currentScene
      }
    };
  };

  const { state } = initialize();

  return {
    get busy() {
      return state.busy;
    },
    exec
  };
};

export { createScheduler };
