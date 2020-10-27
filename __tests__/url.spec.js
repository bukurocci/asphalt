import { decomposeURL, isSameOrigin } from '../src/url';

describe('isSameOrigin', () => {
  test('should be true if protocol, port, and host are the same', () => {
    const url1 = 'https://www.example.com:443/dir1/page1.html';
    const url2 = 'https://www.example.com:443/dir2/page2.html';

    expect(isSameOrigin(url1, url2)).toBe(true);
  });

  test('should be false if protocol is not the same', () => {
    const url1 = 'https://www.example.com/dir1/page1.html';
    const url2 = 'http://www.example.com/dir2/page2.html';

    expect(isSameOrigin(url1, url2)).toBe(false);
  });

  test('should be false if host is not the same', () => {
    const url1 = 'https://www.example.com/dir1/page1.html';
    const url2 = 'https://www.example.net/dir2/page2.html';

    expect(isSameOrigin(url1, url2)).toBe(false);
  });

  test('should be false if port is not the same', () => {
    const url1 = 'https://www.example.com:443/dir1/page1.html';
    const url2 = 'https://www.example.com:8080/dir2/page2.html';

    expect(isSameOrigin(url1, url2)).toBe(false);
  });
});

test('decomposeURL', () => {
  const url = 'https://www.example.com:8080/dir/to/page?query1=a&query2=b#hash';

  expect(decomposeURL(url)).toEqual({
    href: url,
    protocol: 'https:',
    host: 'www.example.com:8080',
    hostname: 'www.example.com',
    port: '8080',
    pathname: '/dir/to/page',
    search: '?query1=a&query2=b',
    hash: '#hash'
  });
});
