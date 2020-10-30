import { decomposeURL, isSameOrigin } from './url';
import { createRouter } from './router';
import { createScheduler } from './scheduler';
import { createPluginRegistry } from './pluginRegistory';
import queryString from 'query-string';
import warningNoDefault from './scene/warningNoDefault';

const defaultOptions = {
  ignoreClassName: 'no-pjax',
  ignoreHash: true,
  baseDir: '/',
  denyDispatchRule: []
};

const diffURLProps = (p1, p2) => {
  const keysOfURLProps = Object.keys(p1);

  return keysOfURLProps.filter((key) => {
    return p1[key] !== p2[key];
  });
};

const createContext = (userOptions) => {
  const options = Object.assign({}, defaultOptions, userOptions);

  const initialize = () => {
    const router = createRouter({
      root: options.baseDir
    });
    const plugins = createPluginRegistry();
    const scheduler = createScheduler();
    const running = false;
    const destroyed = false;
    const queuedURLState = null;
    const here = null;
    const defaultSceneFactory = warningNoDefault;

    return {
      plugins,
      router,
      scheduler,
      defaultSceneFactory,
      state: {
        here,
        queuedURLState,
        running,
        destroyed
      }
    };
  };

  const isImplicitQualifiedTarget = (target) => {
    return target.target !== '_blank' && !target.classList.contains(options.ignoreClassName);
  };

  const allowsDispatch = (fromProps, toProps, target) => {
    const diffProps = diffURLProps(toProps, fromProps);

    // optionでhash違いは無視する指定になっているとき、hashのみ違うのであれば無視する
    // hashが違うのであればhrefも違うため、hashが違った時の配列長は2になる
    const hashOnly = diffProps.length === 2 && diffProps.includes('hash');
    // href="#" の時はhashの違いは無くなるがhrefには違いが現れる
    const emptyHash = diffProps.length === 1 && diffProps[0] === 'href';

    if (options.ignoreHash && (hashOnly || emptyHash)) {
      return false;
    }

    if (toProps.pathname.indexOf(options.baseDir) !== 0) {
      return false;
    }

    return (
      isSameOrigin(fromProps.href, toProps.href) && // 同一オリジンのチェック
      !options.denyDispatchRule.some((rule) => rule(fromProps, toProps, target)) && // ユーザーが定義した無視条件のチェック
      (target == null || isImplicitQualifiedTarget(target))
    ); // aタグのclickイベントから実行しようとしている場合はaタグをチェック
  };

  const handlePopState = (evt) => {
    if (!evt.state) {
      return;
    }

    const toProps = evt.state;

    if (scheduler.busy) {
      state.queuedURLState = toProps;
      return;
    }

    const fromProps = state.here;

    if (!allowsDispatch(fromProps, toProps, null)) {
      return;
    }

    dispatch(toProps, false);
  };

  const handleClick = (evt) => {
    const target = evt.target.closest('a');

    if (!target) {
      return;
    }

    const fromProps = state.here;
    const toProps = decomposeURL(target.href);

    if (!allowsDispatch(fromProps, toProps, target)) {
      return;
    }

    evt.preventDefault();

    // 遷移先と現在地が同じ場合はページ移動をキャンセルして何もしない
    if (toProps.href === fromProps.href) {
      return;
    }

    dispatch(toProps, true);
  };

  const bindEvents = () => {
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleClick);
  };

  const unbindEvents = () => {
    window.removeEventListener('popstate', handlePopState);
    document.removeEventListener('click', handleClick);
  };

  const registerScene = (rule, sceneFactory) => {
    router.route(rule, sceneFactory);
  };

  const unregisterScene = (rule, sceneFactory) => {
    router.unroute(rule, sceneFactory);
  };

  const run = (href) => {
    if (state.destroyed) {
      throw new Error('this context already destroyed. the context cannot be reuse');
    }

    if (state.running) {
      throw new Error('this context is already running');
    }

    state.running = true;

    bindEvents();

    return dispatch(decomposeURL(href), false);
  };

  const dispatch = (props, usePushState = true) => {
    if (scheduler.busy || state.destroyed) {
      return;
    }

    state.here = props;

    const { callback, params } = router.findMatched(props.pathname) || {
      callback: context.defaultSceneFactory,
      params: {}
    };

    const scene = callback(props);

    const routingContext = {
      name: scene.name,
      params,
      query: queryString.parse(props.search, {
        parseNumbers: true,
        parseBooleans: true
      }),
      urlProps: props,
      shouldPushState: usePushState
    };

    return scheduler.exec(scene, plugins, routingContext).then(async () => {
      if (state.queuedURLState) {
        const urlState = state.queuedURLState;
        state.queuedURLState = null;
        await dispatch(urlState, false);
      }
    });
  };

  const manuallyDispatch = (href) => {
    if (state.destroyed) {
      throw new Error('cannot dispatch if this context is destroyed');
    }

    const fromProps = state.here;
    const toProps = decomposeURL(href);

    if (!allowsDispatch(fromProps, toProps, null)) {
      return;
    }

    // 遷移先と現在地が同じ場合はページ移動をキャンセルして何もしない
    if (toProps.href === fromProps.href) {
      return;
    }

    return dispatch(toProps, true);
  };

  const registerDefault = (sceneFactory) => {
    context.defaultSceneFactory = sceneFactory;
  };

  const destroy = () => {
    unbindEvents();

    state.destroyed = true;
  };

  const context = initialize();
  const { state, router, scheduler, plugins } = context;

  return {
    default: registerDefault,
    dispatch: manuallyDispatch,
    plugins,
    registerScene,
    unregisterScene,
    run,
    destroy
  };
};

export { createContext };
