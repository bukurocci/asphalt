import { ok } from "./result";

export const createPayloadFactory = (routingContext = {}) => {

  Object.freeze(routingContext);

  return (result = ok({}), session = {}) => {
    const errors = result.isError;
    const value = result.value;

    return {
      errors,
      value,
      session,
      routingContext
    };
  };
};

const emptyPayload = createPayloadFactory({})();

export const createEmptyPayload = () => {
 return Object.assign({}, emptyPayload);
};
