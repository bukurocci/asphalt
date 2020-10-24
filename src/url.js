const normalizeHost = (host) => {
  const parts = host.split(':');

  if (parts.length === 1) {
    return host;
  }

  const port = parts[1];

  // 443 is default https port, 80 is default http port
  // 80や443はたとえ指定されていたとしても、表示されないのが仕様
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/host
  if (port === '443' || port === '80') {
    return parts[0];
  }

  return host;
};

const normalizePathname = (pathname) => {
  if (pathname.charAt(0) !== '/') {
    return '/' + pathname;
  }

  return pathname;
};

export const decomposeURL = (url) => {

  // IE11でtrainling slashなしのURLの入ったa要素を参照するとなぜか一部のプロパティ（hostなど）が空になるバグがある模様
  // a要素を作ってhrefを入れると期待した動作になる。
  const a = document.createElement('a');
  a.setAttribute('href', url);

  // origin も含めたいところだがIE11が未対応
  // https://developer.mozilla.org/ja/docs/Web/API/HTMLHyperlinkElementUtils
  const { href, protocol, hostname, host, port, pathname, search, hash } = a;

  return {
    href,
    protocol,
    // IEは80（http）や443（https）のデフォルトport番号が a.host についてきてしまうので処理する。
    host: normalizeHost(host),
    hostname,
    port,
    // 上記のように作ったa要素から取得した、pathnameはIE11で / で開始でなくなっているのでその場合足す
    pathname: normalizePathname(pathname),
    search,
    hash,
  };
};

export const isSameOrigin = (url1, url2) => {
  const url1Props = decomposeURL(url1);
  const url2Props = decomposeURL(url2);

  return url1Props.protocol === url2Props.protocol && url1Props.host === url2Props.host && url1Props.port === url2Props.port
};
