import { StatusCode, STATUS_CODE } from '$constants/index';

export class Success<T, E extends BaseError> {
  readonly value: T;
  readonly type = 'success';
  constructor(value: T) {
    this.value = value;
  }
  isSuccess(): this is Success<T, E> {
    return true;
  }
  isFailure(): this is Failure<T, E> {
    return false;
  }
}

export class Failure<T, E extends BaseError> {
  readonly value: E;
  readonly type = 'failure';
  constructor(value: E) {
    this.value = value;
  }
  isSuccess(): this is Success<T, E> {
    return false;
  }
  isFailure(): this is Failure<T, E> {
    return true;
  }
}

export type Result<T, E extends BaseError> = Success<T, E> | Failure<T, E>;

export const CODE = {
  BASE: '#base',
  NETWORK: '#network',
  HTTP: '#http',
  FILE_READER: '#fileReader',
  OAS: '#oas',
} as const;
export type Code = typeof CODE[keyof typeof CODE];

export const NAME = {
  BASE: 'base',
  NETWORK: 'network',
  HTTP: 'http',
  FILE_READER: 'fileReader',
  OAS: 'oas',
} as const;
export type Name = typeof NAME[keyof typeof NAME];

export class BaseError extends Error {
  code: Code = CODE.BASE;
  name: Name = NAME.BASE;
}

export class NetworkError extends BaseError {
  code: Code = CODE.NETWORK;
  name: Name = NAME.NETWORK;
}

export class HTTPError extends BaseError {
  code: Code = CODE.HTTP;
  name: Name = NAME.HTTP;
}

export class HTTP400Error extends HTTPError {
  message = 'TODO';
}

export class HTTP401Error extends HTTPError {
  message = 'TODO';
}

export class HTTP403Error extends HTTPError {
  message = 'TODO';
}

export class HTTPUnexpectedError extends HTTPError {
  message = 'TODO';
}

export class FileReaderError extends BaseError {
  code: Code = CODE.FILE_READER;
  name: Name = NAME.FILE_READER;
}

export class OASError extends BaseError {
  code: Code = CODE.OAS;
  name: Name = NAME.OAS;
}

export const getHTTPError = function (statusCode: StatusCode): BaseError {
  switch (statusCode) {
    case STATUS_CODE.BAD_REQUEST:
      return new HTTP400Error();
    case STATUS_CODE.UNAUTHORIZED:
      return new HTTP401Error();
    case STATUS_CODE.FORBIDDEN:
      return new HTTP403Error();
    default:
      return new HTTPError();
  }
};
