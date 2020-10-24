class LogBuffer {
  get size() {
    return this._buffer.length;
  }

  get empty() {
    return this._head === this._tail;
  }

  get full() {
    return (this._tail + 1) % this._buffer.length === this._head;
  }

  constructor(size = 0) {
    this._buffer = new Array(size);
    this._head = 0;
    this._tail = 0;
  }

  push(item) {
    // バッファの末尾に要素を入れる
    // バッファが一周した場合 push されたデータは古いデータを上書きする
    this._buffer[this._tail] = item;

    // 末尾の index を更新する
    const newTail = (this._tail + 1) % this._buffer.length;

    // 循環して head の index とぶつかった場合、
    // 現在の head の要素は最後の挿入した要素で塗りつぶされているので
    // head を次に進めておく（head は pop されていない情報のうち一番古い情報を常に参照しておく必要がある）
    if (newTail === this._head) {
      this._head = (this._head + 1) % this._buffer.length;
    }

    this._tail = newTail;
  }

  pop() {
    if (this.empty) {
      throw new Error('the buffer is empty');
    }

    const newTail = (this._tail === 0 ? this._buffer.length : this._tail) - 1;
    const item = this._buffer[newTail];
    this._tail = newTail;

    return item;
  }

  flush() {
    this._buffer = new Array(this._buffer.length);
    this._head = 0;
    this._tail = 0;
  }

  toArray() {
    const array = [];
    let head = this._head;

    while (head !== this._tail) {
      array.push(this._buffer[head]);
      head = (head + 1) % this._buffer.length;
    }

    return array;
  }
}

const createCache = (size) => {
  return new LogBuffer(size);
};

export { createCache };
