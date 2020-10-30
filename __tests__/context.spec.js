import * as asphalt from '../src/index';

describe('basic transition', () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="content">
      <ul>
        <li><a href="/path/to/index2.html" id="enable-transition-test">dispatch transition</a></li>
      </ul>
    </div>`;
  });

  test('the first run', async () => {
    const transition = asphalt.createContext();
    const mockEnter = jest.fn((payload) => []);
    const scene = asphalt.defineScene('test', {
      enter: mockEnter
    });
    transition.registerScene('/', scene);

    await transition.run(location.href);

    expect(mockEnter).toHaveBeenCalledTimes(1);

    transition.destroy();
  });

  test('from the second run via click', async (done) => {
    const transition = asphalt.createContext();

    const mockEnter1 = jest.fn((payload) => []);
    const mockLeave1 = jest.fn((payload) => []);
    const mockEnter2 = jest.fn((payload) => {
      test();
      return [];
    });
    const mockLeave2 = jest.fn((payload) => []);

    const scene = asphalt.defineScene('test', {
      enter: mockEnter1,
      leave: mockLeave1
    });
    const scene2 = asphalt.defineScene('test2', {
      enter: mockEnter2,
      leave: mockLeave2
    });

    const test = () => {
      expect(mockEnter1).toHaveBeenCalledTimes(1);
      expect(mockLeave1).toHaveBeenCalledTimes(1);
      expect(mockEnter2).toHaveBeenCalledTimes(1);
      expect(mockLeave2).toHaveBeenCalledTimes(0);
      transition.destroy();
      done();
    };

    transition.registerScene('/', scene);
    transition.registerScene('/path/to/index2.html', scene2);

    await transition.run(location.href);

    const a = document.getElementById('enable-transition-test');

    a.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
    );
  });

  test('from the second run via manual dispatching', async () => {
    const transition = asphalt.createContext();

    const mockEnter1 = jest.fn((payload) => []);
    const mockLeave1 = jest.fn((payload) => []);
    const mockEnter2 = jest.fn((payload) => []);
    const mockLeave2 = jest.fn((payload) => []);

    const scene = asphalt.defineScene('test', {
      enter: mockEnter1,
      leave: mockLeave1
    });
    const scene2 = asphalt.defineScene('test2', {
      enter: mockEnter2,
      leave: mockLeave2
    });

    transition.registerScene('/', scene);
    transition.registerScene('/path/to/index2.html', scene2);

    await transition.run(location.href);
    await transition.dispatch('/path/to/index2.html');

    expect(mockEnter1).toHaveBeenCalledTimes(1);
    expect(mockLeave1).toHaveBeenCalledTimes(1);
    expect(mockEnter2).toHaveBeenCalledTimes(1);
    expect(mockLeave2).toHaveBeenCalledTimes(0);

    transition.destroy();
  });

  test('cannot exec `run` method twice', async () => {
    const transition = asphalt.createContext();
    transition.default(asphalt.defineScene('test', {}));

    await transition.run(location.href);

    expect(() => {
      transition.run(location.href);
    }).toThrow();

    transition.destroy();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });
});

describe('user option', () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="content">
      <ul>
        <li><a href="/path/to/index2.html" id="enable-transition-test">dispatch transition test</a></li>
        <li><a href="/path/to/index2.html" class="no-pjax-test" id="no-pjax-test">ignore class test</a></li>
        <li><a href="/path2/to/index.html" id="other-directory">other directory test</a></li>
        <li><a href="/#hashtest" class="no-pjax" id="ignore-hash-test">no pjax test</a></li>
      </ul>
    </div>`;
  });

  test('should ignore <a> with the class name from no-pjax option', async (done) => {
    const transition = asphalt.createContext({
      ignoreClassName: 'no-pjax-test'
    });

    const mockLeave = jest.fn((payload) => []);

    const scene = asphalt.defineScene('test', {
      leave: mockLeave
    });
    const scene2 = asphalt.defineScene('test2', {});

    transition.registerScene('/', scene);
    transition.registerScene('/path/to/index2.html', scene2);

    await transition.run(window.location.href);

    const a = document.getElementById('no-pjax-test');
    const clickHandler = (evt) => {
      evt.preventDefault();
    };
    a.addEventListener('click', clickHandler);
    a.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
    );
    a.removeEventListener('click', clickHandler);

    setTimeout(() => {
      expect(mockLeave).toHaveBeenCalledTimes(0);
      transition.destroy();
      done();
    }, 1000);
  });

  test('should ignore a path which is not descendant of the baseDir option via click', async (done) => {
    const transition = asphalt.createContext({
      baseDir: '/path/to/'
    });

    const mockLeave = jest.fn((payload) => []);

    const scene = asphalt.defineScene('test', {
      leave: mockLeave
    });

    transition.registerScene('/', scene);

    await transition.run(window.location.href + 'path/to/');

    const a = document.getElementById('other-directory');
    const clickHandler = (evt) => {
      evt.preventDefault();
    };
    a.addEventListener('click', clickHandler);
    a.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
    );
    a.removeEventListener('click', clickHandler);

    setTimeout(() => {
      expect(mockLeave).toHaveBeenCalledTimes(0);
      transition.destroy();

      done();
    }, 1000);
  });

  test('should ignore a path which is not descendant of the baseDir option via manual dispatching', async (done) => {
    const transition = asphalt.createContext({
      baseDir: '/path/to/'
    });
    const mockLeave = jest.fn((payload) => []);
    const scene = asphalt.defineScene('test', {
      leave: mockLeave
    });

    transition.registerScene('/', scene);

    await transition.run(window.location.href + 'path/to/');
    await transition.dispatch('/path2/to/index.html');

    setTimeout(() => {
      expect(mockLeave).toHaveBeenCalledTimes(0);
      transition.destroy();
      done();
    }, 1000);
  });

  test('should not dispatch when ignoreHash option is true', async () => {
    const transition = asphalt.createContext();

    const mockEnter = jest.fn((payload) => []);
    const mockLeave = jest.fn((payload) => []);

    transition.default(
      asphalt.defineScene('test', {
        enter: mockEnter,
        leave: mockLeave
      })
    );

    await transition.run(location.href);
    await transition.dispatch('/#hash');

    expect(mockEnter).toHaveBeenCalledTimes(1);
    expect(mockLeave).toHaveBeenCalledTimes(0);

    transition.destroy();
  });

  test('should dispatch via hash change when ignoreHash option is false', async () => {
    const transition = asphalt.createContext({
      ignoreHash: false
    });

    const mockEnter = jest.fn((payload) => []);
    const mockLeave = jest.fn((payload) => []);

    transition.default(
      asphalt.defineScene('test', {
        enter: mockEnter,
        leave: mockLeave
      })
    );

    await transition.run(location.href);
    await transition.dispatch('/#hash');

    expect(mockEnter).toHaveBeenCalledTimes(2);
    expect(mockLeave).toHaveBeenCalledTimes(1);

    // try to move with the same hash
    await transition.dispatch('/#hash');

    expect(mockEnter).toHaveBeenCalledTimes(2);
    expect(mockLeave).toHaveBeenCalledTimes(1);

    transition.destroy();
  });

  test('should respect the denyDispatchRule option', async () => {
    const transition = asphalt.createContext({
      denyDispatchRule: [
        (fromProps, toProps, target) => {
          return toProps.pathname === '/denial/path/to/';
        },
        (fromProps, toProps, target) => {
          return toProps.pathname === '/denial/path/to2/';
        }
      ]
    });

    const mockEnter = jest.fn((payload) => []);
    const mockLeave = jest.fn((payload) => []);

    transition.default(
      asphalt.defineScene('test', {
        enter: mockEnter,
        leave: mockLeave
      })
    );

    await transition.run(location.href);

    expect(mockEnter).toHaveBeenCalledTimes(1);
    expect(mockLeave).toHaveBeenCalledTimes(0);

    // this transition will be ignored
    await transition.dispatch('/denial/path/to/');

    expect(mockEnter).toHaveBeenCalledTimes(1);
    expect(mockLeave).toHaveBeenCalledTimes(0);

    // this transition will be ignored
    await transition.dispatch('/denial/path/to2/');

    expect(mockEnter).toHaveBeenCalledTimes(1);
    expect(mockLeave).toHaveBeenCalledTimes(0);

    // this transition will be done
    await transition.dispatch('/path/to/');

    expect(mockEnter).toHaveBeenCalledTimes(2);
    expect(mockLeave).toHaveBeenCalledTimes(1);

    transition.destroy();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });
});

describe('implicit rules', () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="content">
      <ul>
        <li><a href="/path/to/" target="_blank" id="ignore-target-blank">ignore target _blank test</a></li>
        <li><a href="http://www.example.com/" id="ignore-different-origin">not the same origin test</a></li>
      </ul>
    </div>`;
  });

  test('should ignore if destined path is the same as departed path', async () => {
    const transition = asphalt.createContext();

    const mockEnter = jest.fn((payload) => []);
    const mockLeave = jest.fn((payload) => []);
    transition.default(
      asphalt.defineScene('test', {
        enter: mockEnter,
        leave: mockLeave
      })
    );

    await transition.run(location.href);
    await transition.dispatch('/');

    expect(mockEnter).toHaveBeenCalledTimes(1);
    expect(mockLeave).toHaveBeenCalledTimes(0);

    transition.destroy();
  });

  test('should ignore if <a>\'s target attribute is "_blank"', async (done) => {
    const transition = asphalt.createContext();

    const mockEnter = jest.fn((payload) => []);
    const mockLeave = jest.fn((payload) => []);

    transition.default(
      asphalt.defineScene('test', {
        enter: mockEnter,
        leave: mockLeave
      })
    );

    await transition.run(location.href);

    const a = document.getElementById('ignore-target-blank');
    const clickHandler = (evt) => {
      evt.preventDefault();
    };
    a.addEventListener('click', clickHandler);
    a.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
    );
    a.removeEventListener('click', clickHandler);

    setTimeout(() => {
      expect(mockEnter).toHaveBeenCalledTimes(1);
      expect(mockLeave).toHaveBeenCalledTimes(0);
      transition.destroy();

      done();
    }, 1000);
  });

  test('should ignore if destined url is the different origin', async (done) => {
    const transition = asphalt.createContext();

    const mockEnter = jest.fn((payload) => []);
    const mockLeave = jest.fn((payload) => []);
    transition.default(
      asphalt.defineScene('test', {
        enter: mockEnter,
        leave: mockLeave
      })
    );

    await transition.run(location.href);

    const a = document.getElementById('ignore-different-origin');
    const clickHandler = (evt) => {
      evt.preventDefault();
    };
    a.addEventListener('click', clickHandler);
    a.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
    );
    a.removeEventListener('click', clickHandler);

    setTimeout(() => {
      expect(mockEnter).toHaveBeenCalledTimes(1);
      expect(mockLeave).toHaveBeenCalledTimes(0);
      transition.destroy();
      done();
    }, 1000);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });
});

describe('default scene', () => {
  test('can register the default scene', async () => {
    const transition = asphalt.createContext();
    const mockEnter = jest.fn((payload) => []);
    const mockLeave = jest.fn((payload) => []);

    transition.default(
      asphalt.defineScene('test', {
        enter: mockEnter,
        leave: mockLeave
      })
    );

    await transition.run(location.href);
    await transition.dispatch('/path/to/');

    expect(mockEnter).toHaveBeenCalledTimes(2);
    expect(mockLeave).toHaveBeenCalledTimes(1);

    transition.destroy();
  });

  test('should warn if context has no default scene and goes unknown destination', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation((x) => x);

    const transition = asphalt.createContext();

    const mockEnter = jest.fn((payload) => []);
    const mockLeave = jest.fn((payload) => []);

    const scene = asphalt.defineScene('test', {
      enter: mockEnter,
      leave: mockLeave
    });

    transition.registerScene('/', scene);

    await transition.run(location.href);
    await transition.dispatch('/path/to/');

    expect(warnSpy.mock.calls.length).toBe(1);
    expect(mockEnter).toHaveBeenCalledTimes(1);
    expect(mockLeave).toHaveBeenCalledTimes(1);

    transition.destroy();
  });
});

describe('destroy asphalt context', () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="content">
      <ul>
        <li><a href="/path/to/" id="destroy-test">go to /path/to/</a></li>
      </ul>
    </div>`;
  });

  test('can destroy the context', async (done) => {
    const transition = asphalt.createContext();

    const mockEnter = jest.fn((payload) => []);
    const mockLeave = jest.fn((payload) => []);

    transition.default(
      asphalt.defineScene('test', {
        enter: mockEnter,
        leave: mockLeave
      })
    );

    await transition.run(window.location.href);

    transition.destroy();

    // the destroyed context cannot re-run
    expect(() => {
      transition.run();
    }).toThrow();

    // the destroyed context connot dispatch
    expect(() => {
      transition.dispatch('/path/to/');
    }).toThrow();

    // the destroyed context don't listen events
    const a = document.getElementById('destroy-test');
    const clickHandler = (evt) => {
      evt.preventDefault();
    };
    a.addEventListener('click', clickHandler);
    a.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
    );
    a.removeEventListener('click', clickHandler);

    setTimeout(() => {
      expect(mockEnter).toHaveBeenCalledTimes(1);
      expect(mockLeave).toHaveBeenCalledTimes(0);

      done();
    }, 1000);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });
});

describe('misc', () => {
  test('routingContext', async () => {
    const transition = asphalt.createContext({
      ignoreHash: false
    });

    const mockEnter = jest.fn((payload) => []);
    const mockLeave = jest.fn((payload) => []);

    const scene = asphalt.defineScene('test', {
      enter: mockEnter,
      leave: mockLeave
    });

    transition.registerScene('/', scene);
    transition.registerScene('/:path/:to/', scene);

    await transition.run(window.location.href);
    await transition.dispatch('/path/to/?query=value&query2=a&query2=b#hash');

    expect(mockEnter.mock.calls[0][0].routingContext).toEqual({
      name: 'test',
      params: {},
      query: {},
      urlProps: {
        href: 'http://localhost/',
        protocol: 'http:',
        host: 'localhost',
        hostname: 'localhost',
        port: '',
        pathname: '/',
        search: '',
        hash: ''
      },
      shouldPushState: false
    });

    expect(mockEnter.mock.calls[1][0].routingContext).toEqual({
      name: 'test',
      params: {
        path: 'path',
        to: 'to'
      },
      query: {
        query: 'value',
        query2: ['a', 'b']
      },
      urlProps: {
        href: 'http://localhost/path/to/?query=value&query2=a&query2=b#hash',
        protocol: 'http:',
        host: 'localhost',
        hostname: 'localhost',
        port: '',
        pathname: '/path/to/',
        search: '?query=value&query2=a&query2=b',
        hash: '#hash'
      },
      shouldPushState: true
    });
  });
});
