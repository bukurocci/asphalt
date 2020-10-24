class Result {
  get isError() {
    return this._left != null;
  }

  get isOk() {
    return this._right != null;
  }

  get value() {
    return this.isOk ? this._right : this._left;
  }

  constructor(error, ok) {
    this._left = error;
    this._right = ok;
  }

  static ok(value) {
    return new Result(null, value);
  }

  static error(e) {
    return new Result(e, null);
  }
}

export const ok = (value) => {
  return Result.ok(value);
};

export const error = (error) => {
  return Result.error(error);
};
