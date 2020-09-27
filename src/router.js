import { pathToRegexp } from 'path-to-regexp';

const createRouter = () => {
  const ruleMap = new Map();

  const route = (pathname, callback) => {
    if(ruleMap.has(pathname)) {
      console.warn(`[warning] overriden by the new callback function due to the path of '${pathname}' already registered`)
    }

    const pathRe = pathToRegexp(pathname);

    ruleMap.set(pathname, {
      pathRe,
      callback
    });
  };

  const unroute = (pathname) => {
    if(!ruleMap.has(pathname)) {
      return;
    }

    ruleMap.delete(pathname);
  };

  const findCallback = (pathname) => {
    const rules = Array.from(ruleMap.values());

    for (let i = 0; i < rules.length; i++) {
      const { pathRe, callback } = rules[i];
      const result = pathRe.exec(pathname);

      if(result) {
        return callback
      }
    }

    return null;
  };

  return {
    route,
    unroute,
    findCallback
  }
};

export { createRouter };