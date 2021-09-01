import {
  HTTPStatusCode,
  HTTP_STATUS,
  HTTP_STATUS_CODE,
} from '$constants/index';

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

export class BaseError extends Error {
  code = '#base';
  name = 'Base Error';
  message = 'An error has occured.';
}

export class NetworkError extends BaseError {
  code = '#network';
  name = 'Network Error';
  message = "Couldn't establish a connection.";
}

export class HTTPError extends BaseError {
  code = '#http';
  name = 'HTTP Error';
  message = 'A HTTP-related error has occured.';
}

export class HTTP400Error extends HTTPError {
  code = '#http-400';
  name = HTTP_STATUS[HTTP_STATUS_CODE.BAD_REQUEST].name;
  message = HTTP_STATUS[HTTP_STATUS_CODE.BAD_REQUEST].message;
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
  code = '#fileReader';
  name = 'File Reader Error';
  message = "Counln't read a file properly.";
}

export class OASError extends BaseError {
  code = '#oas';
  name = 'OAS Error';
  message = 'Incorrect OAS document.';
}

export const getHTTPError = function (statusCode: HTTPStatusCode): BaseError {
  switch (statusCode) {
    case HTTP_STATUS_CODE.BAD_REQUEST:
      return new HTTP400Error();
    case HTTP_STATUS_CODE.UNAUTHORIZED:
      return new HTTP401Error();
    case HTTP_STATUS_CODE.FORBIDDEN:
      return new HTTP403Error();
    default:
      return new HTTPError();
  }
};
