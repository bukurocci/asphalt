import { match } from 'path-to-regexp';

const defaultOptions = {
  root: '/'
};

const slashForward = (path) => {
  if (path.charAt(0) !== '/') {
    return '/' + path;
  }

  return path;
};

const createRouter = (userOptions = {}) => {
  const ruleMap = new Map();
  const options = Object.assign({}, defaultOptions, userOptions);

  const route = (pathname, callback) => {
    if (ruleMap.has(pathname)) {
      console.warn(
        `[warning] overriden by the new callback function due to the path of '${pathname}' already registered`
      );
    }

    ruleMap.set(pathname, {
      matcher: match(pathname),
      callback
    });
  };

  const unroute = (pathname) => {
    if (!ruleMap.has(pathname)) {
      return;
    }

    ruleMap.delete(pathname);
  };

  const findMatched = (pathname) => {
    const rules = Array.from(ruleMap.values());

    if (pathname.indexOf(options.root) !== 0) {
      return null;
    }

    const relativePathname = slashForward(pathname.substring(options.root.length));

    for (let i = 0; i < rules.length; i++) {
      const { matcher, callback } = rules[i];

      const matched = matcher(relativePathname);
      const { params } = matched;

      if (matched) {
        return { callback, params };
      }
    }

    return null;
  };

  return {
    route,
    unroute,
    findMatched
  };
};

export { createRouter };
