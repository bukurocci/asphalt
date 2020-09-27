import { decomposeURL } from './url';
import { createRouter } from './router';
import { createScheduler } from './scheduler';
import { createPluginRegistry } from './pluginRegistory';


const defaultOptions = {
  ignoreClassName: 'no-pjax'
}

/*
 * 指定したURLに対してブラウザのデフォルトのページ遷移に介入するかどうか。trueの場合pjaxが行われる
 *
 */
const canPreventDefaultNavigation = urlProps => {
  return urlProps.protocol === location.protocol || urlProps.host === location.host || urlProps.port === location.port;
};

const createContext = (userOptions) => {
  const options = Object.assign({}, defaultOptions, userOptions);

  const initialize = () => {
    const router = createRouter();
    const plugins = createPluginRegistry();
    const scheduler = createScheduler();
    const running = false;
    const storedURLState = null;
    const hooks = {};

    return {
      plugins,
      router,
      scheduler,
      hooks,
      state: {
        storedURLState,
        running,
      }
    };
  };

  const handlePopState = (evt) => {
    if(!evt.state) {
      return;
    }

    if(scheduler.busy) {
      state.storedURLState = evt.state;
      return;
    }

    const props = evt.state;

    if(!canPreventDefaultNavigation(props)) {
      return;
    }

    go(props, false);
  };

  const handleTransitDispatch = (evt) => {
    const target = evt.target.closest('a');

    if(!target || target.classList.contains(options.ignoreClassName) || target.target === '_blank' || target.getAttribute('href').charAt(0) === '#') {
      return;
    }

    const props = decomposeURL(target.href);

    if(!canPreventDefaultNavigation(props)) {
      return;
    }

    evt.preventDefault();

    go(props);
  };

  const bindEvents = () => {
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleTransitDispatch);
  };

  const unbindEvents = () => {
    window.removeEventListener('popstate', handlePopState);
    document.removeEventListener('click', handleTransitDispatch);
  }

  const registerScene = (rule, sceneFactory) => {
    router.route(rule, sceneFactory);
  };

  const unregisterScene = (rule, sceneFactory) => {
    router.unroute(rule, sceneFactory);
  }

  const run = (href) => {
    if(state.running) {
      return;
    }

    state.running = true;

    bindEvents();

    const props = decomposeURL(href);

    go(props, false);
  };

  const go = async(props, usePushState = true) => {
    if (scheduler.busy) {
      return;
    }

    const callback = router.findCallback(props.pathname);

    await scheduler.exec(callback(props), plugins, {
      urlProps: props,
      shouldPushState: usePushState
    });

    if(state.storedURLState) {
      go(state.storedURLState, false);
      state.storedURLState = null;
    }
  };


  const destroy = () => {
    unbindEvents();
  };

  const { state, router, scheduler, plugins } = initialize();

  return {
    plugins,
    registerScene,
    unregisterScene,
    run,
    destroy
  }
};

export { createContext };
