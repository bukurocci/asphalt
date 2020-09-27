import { ok, error, createPayloadFromResult } from './payload';

const noopHooks = {
  beforeEnter() {},
  enter() {},
  afterEnter() {},
  beforeLeave() {},
  leave() {},
  afterLeave() {},
  beforeError() {},
  error() {},
  afterError() {}
};

const createScheduler = (options) => {

  const resolveHook = async(hookType, processes, initialPayload = createPayloadFromResult(ok({}))) => {
    if(processes.length === 0) {
      return initialPayload;
    }

    let carried = initialPayload;

    for (let i = 0; i < processes.length; i++) {
      const process = processes[i];
      const result = await process(carried);
      carried = createPayloadFromResult(result)
    }

    return Object.assign({}, state.payload, carried);
  };

  const exec = async(scene, plugins, context = {}) => {
    if(state.busy) {
      return;
    }

    state.busy = true;
    const departed = state.currentScene;
    const destined = scene;

    if(departed) {
      state.payload = await resolveHook('beforeLeave', plugins.findHandlers('beforeLeave'), state.payload);
      state.payload = await resolveHook('leave', departed.leave(state.payload), state.payload);
      state.payload = await resolveHook('afterLeave',  plugins.findHandlers('afterLeave'), state.payload);

      // 退出処理が完了した時にエラーが残っていたら異常系のトランジションを行う
      if(state.payload.error) {
        console.log('error on leave')
      }
    }

    state.payload = createPayloadFromResult(ok(Object.assign({}, state.payload.value, context)));
    state.payload = await resolveHook('beforeEnter', plugins.findHandlers('beforeEnter'), state.payload);
    state.payload = await resolveHook('enter', destined.enter(state.payload), state.payload);
    state.payload = await resolveHook('afterEnter', plugins.findHandlers('afterEnter'), state.payload);

    // 入場処理が完了した時にエラーが残っていたら異常系のトランジションを行う
    if(state.payload.error) {
      console.log('error on enter')
    }

    state.currentScene = destined;
    state.busy = false;
  }

  const initialize = (options = {}) => {
    const currentScene = null;
    const hooks = Object.assign({}, noopHooks, options.hooks);
    const busy = false;
    const payload = createPayloadFromResult(ok({}));

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
  }
};

export { createScheduler }
