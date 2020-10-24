import { createPlugin } from '../createPlugin';

const pushStatePlugin = createPlugin('pushState', ({ ok, error }) => {
  const beforeEnter = async(payload) => {
    const { errors, value } = payload;
    const { urlProps, shouldPushState } = payload.routingContext;

    if (errors) {
      return error(value);
    }

    if (shouldPushState) {
      history.pushState(null, null, urlProps.href);
    }

    return ok(value);
  };

  const afterEnter = async(payload) => {
    const { errors, value } = payload;
    const { urlProps } = payload.routingContext;

    if (errors) {
      return error(value);
    }

    history.replaceState(urlProps, document.title, urlProps.href);

    return ok(value);
  };

  return {
    beforeEnter,
    afterEnter
  };
});

export { pushStatePlugin };
