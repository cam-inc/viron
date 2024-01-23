import { HTTPStatusCode, HTTP_STATUS } from '~/constants/index';

export type Result<T, E extends BaseError> = Success<T, E> | Failure<T, E>;

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

export class BaseError extends Error {
  code = '#base';
  name = 'Base Error';
}

export class NetworkError extends BaseError {
  code = '#network';
  name = 'Network Error';
  type = 'network';
}

export class HTTPError extends NetworkError {
  code = '#http';
  name = 'HTTP Error';
}

export class HTTP400Error extends HTTPError {
  code = `#http-${HTTP_STATUS.BAD_REQUEST.code}`;
  name = HTTP_STATUS.BAD_REQUEST.name;
}

export class HTTP401Error extends HTTPError {
  code = `#http-${HTTP_STATUS.UNAUTHORIZED.code}`;
  name = HTTP_STATUS.UNAUTHORIZED.name;
}

export class HTTP403Error extends HTTPError {
  code = `#http-${HTTP_STATUS.FORBIDDEN.code}`;
  name = HTTP_STATUS.FORBIDDEN.name;
}

export class HTTP404Error extends HTTPError {
  code = `#http-${HTTP_STATUS.NOT_FOUND.code}`;
  name = HTTP_STATUS.NOT_FOUND.name;
}

export class HTTPUnexpectedError extends HTTPError {
  code = `#http-unexpected`;
  name = 'HTTP Unexpected Error';
}

export class FileReaderError extends BaseError {
  code = '#fileReader';
  name = 'File Reader Error';
}

export class EndpointError extends BaseError {
  code = '#endpoint';
  name = 'Endpoint Error';
}

export class EndpointDuplicatedError extends EndpointError {
  code = '#endpointDuplicated';
  name = 'Endpoint Duplicated Error';
}

export class EndpointUndefindedError extends EndpointError {
  code = '#endpointDuplicated';
  name = 'Endpoint Undefinded Error';
}

export class EndpointExportError extends EndpointError {
  code = '#endpointExport';
  name = 'Endpoint Export Error';
}

export class EndpointGroupError extends BaseError {
  code = '#endpointGroup';
  name = 'Endpoint Group Error';
}

export class EndpointGroupDuplicatedError extends EndpointGroupError {
  code = '#endpointGroupDuplicated';
  name = 'Endpoint Group Duplicated Error';
}

export class OASError extends BaseError {
  code = '#oas';
  name = 'OAS Error';
}

export class UnexpectedError extends BaseError {
  code = '#unexpected';
  name = 'Unexpected Error';
}

export class UnhandledError extends BaseError {
  code = '#unhandled';
  name = 'Unhandled Error';
}

export const getHTTPError = (statusCode: HTTPStatusCode): BaseError => {
  switch (statusCode) {
    case HTTP_STATUS.BAD_REQUEST.code:
      return new HTTP400Error();
    case HTTP_STATUS.UNAUTHORIZED.code:
      return new HTTP401Error();
    case HTTP_STATUS.FORBIDDEN.code:
      return new HTTP403Error();
    default:
      return new HTTPError();
  }
};
