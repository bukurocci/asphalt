import { createProcess } from '../createProcess';

const defaultOptions = {
  method: 'GET',
  headers: {
    'Content-Type': 'text/html'
  }
};

const fetchHTML = (href, option, { ok, error }) => {
  return async (payload) => {
    const { errors, value } = payload;

    if (errors) {
      return error(value);
    }

    const options = Object.assign({}, defaultOptions, option);
    return await fetch(href, options)
      .then((data) => {
        return data.text().then((text) => {
          const domParser = new DOMParser();
          const htmlDOM = domParser.parseFromString(text, 'text/html');

          return ok(Object.assign(payload.value, { htmlDOM }));
        });
      })
      .catch((e) => error(e));
  };
};

const fetchHTMLProcess = createProcess((handlers) => {
  return (href, options = {}) => fetchHTML(href, options, handlers);
});

export { fetchHTMLProcess };
