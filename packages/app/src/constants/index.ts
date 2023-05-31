import { isSSR } from '~/utils';

export const URL = {
  DOCUMENTATION: 'https://discovery.viron.plus/docs/introduction/',
  BLOG: 'https://discovery.viron.plus/blog/',
  RELEASE_NOTES: 'https://discovery.viron.plus/docs/References/changelog/',
  HELP: 'https://discovery.viron.plus/docs/References/faq/',
  GITHUB: 'https://github.com/cam-inc/viron/',
  TWITTER: 'https://twitter.com/TODO',
} as const;
export type Url = (typeof URL)[keyof typeof URL];

export const ENVIRONMENTAL_VARIABLE = {
  AUTOCOMPLETE_VALUE: '${autocompleteValue}',
  OAUTH_REDIRECT_URI: '${oauthRedirectURI}',
} as const;
export type EnvironmentalVariable =
  (typeof ENVIRONMENTAL_VARIABLE)[keyof typeof ENVIRONMENTAL_VARIABLE];
export const isEnvironmentalVariable = (
  str: string
): str is EnvironmentalVariable => {
  return (Object.values(ENVIRONMENTAL_VARIABLE) as string[]).includes(str);
};

export const OAUTH_REDIRECT_URI = (function () {
  if (isSSR) {
    return '';
  }
  return `${globalThis.location.origin}/oauthredirect`;
})();

export const HTTP_STATUS = {
  CONTINUE: {
    name: 'Continue',
    code: 100,
  },
  SWITCHING_PROTOCOL: {
    name: 'Swithing Protocols',
    code: 101,
  },
  PROCESSING: {
    name: 'Processing',
    code: 102,
  },
  EARLY_HINTS: {
    name: 'Early Hints',
    code: 103,
  },
  OK: {
    name: 'OK',
    code: 200,
  },
  CREATED: {
    name: 'Created',
    code: 201,
  },
  ACCEPTED: {
    name: 'Accepted',
    code: 202,
  },
  NON_AUTHORITATIVE_INFORMATION: {
    name: 'Non-Authoritative information',
    code: 203,
  },
  NO_CONTENT: {
    name: 'No Content',
    code: 204,
  },
  RESET_CONTENT: {
    name: 'Reset Content',
    code: 205,
  },
  PARTIAL_CONTENT: {
    name: 'Partial Content',
    code: 206,
  },
  MULTI_STATUS: {
    name: 'Multi Status',
    code: 207,
  },
  ALREADY_REPORTED: {
    name: 'Already Reported',
    code: 208,
  },
  IM_USED: {
    name: 'IM Used',
    code: 226,
  },
  MULTIPLE_CHOICE: {
    name: 'Multiple Choice',
    code: 300,
  },
  MOVED_PERMANENTLY: {
    name: 'Moved Permanently',
    code: 301,
  },
  FOUND: {
    name: 'Found',
    code: 302,
  },
  SEE_OTHER: {
    name: 'See Other',
    code: 303,
  },
  NOT_MODIFIED: {
    name: 'Not Modified',
    code: 304,
  },
  TEMPORARY_REDIRECT: {
    name: 'Temporary Redirect',
    code: 307,
  },
  PERMANENT_REDIRECT: {
    name: 'Permanent Redirect',
    code: 308,
  },
  BAD_REQUEST: {
    name: 'Bad Request',
    code: 400,
  },
  UNAUTHORIZED: {
    name: 'Unauthorized',
    code: 401,
  },
  PAYMENT_REQUIRED: {
    name: 'Payment Required',
    code: 402,
  },
  FORBIDDEN: {
    name: 'Forbidden',
    code: 403,
  },
  NOT_FOUND: {
    name: 'Not Found',
    code: 404,
  },
  METHOD_NOT_ALLOWED: {
    name: 'Method Not Allowed',
    code: 405,
  },
  NOT_ACCEPTABLE: {
    name: 'Not Acceptable',
    code: 406,
  },
  PROXY_AUTHENTICATION_REQUIRED: {
    name: 'Proxy Authentication Required',
    code: 407,
  },
  REQUEST_TIMEOUT: {
    name: 'Request Timeout',
    code: 408,
  },
  CONFLICT: {
    name: 'Conflict',
    code: 409,
  },
  GONE: {
    name: 'Gone',
    code: 410,
  },
  LENGTH_REQUIRED: {
    name: 'Length Required',
    code: 411,
  },
  PRECONDITION_FAILED: {
    name: 'Precondition Failed',
    code: 412,
  },
  PAYLOAD_TOO_LARGE: {
    name: 'Payload Too Large',
    code: 413,
  },
  URI_TOO_LONG: {
    name: 'URI Too Long',
    code: 414,
  },
  UNSUPPORTED_MEDIA_TYPE: {
    name: 'Unsupportedd Media Type',
    code: 415,
  },
  RANGE_NOT_SATISFIABLE: {
    name: 'Range Not Satisfiable',
    code: 416,
  },
  EXPECTATION_FAILED: {
    name: 'Expectation Failed',
    code: 417,
  },
  IM_A_TEAPOT: {
    name: 'Im a Teapot',
    code: 418,
  },
  MISDIRECTED_REQUEST: {
    name: 'Misdirected Request',
    code: 421,
  },
  UNPROCESSABLE_ENTITY: {
    name: 'Unprocessable Entity',
    code: 422,
  },
  LOCKED: {
    name: 'Locked',
    code: 423,
  },
  FAILED_DEPENDENCY: {
    name: 'Failed Dependency',
    code: 424,
  },
  TOO_EARLY: {
    name: 'Too Early',
    code: 425,
  },
  UPGRADE_REQUIRED: {
    name: 'Upgrade Required',
    code: 426,
  },
  PRECONDITION_REQUIRED: {
    name: 'Precondition Required',
    code: 428,
  },
  TOO_MANY_REQUESTS: {
    name: 'Too Many Requests',
    code: 429,
  },
  REQUEST_HEADER_FIELDS_TOO_LARGE: {
    name: 'Request Header Fields Too Large',
    code: 431,
  },
  UNAVAILABLE_FOR_LEGAL_REASONS: {
    name: 'Unavailable For Legal Reasons',
    code: 451,
  },
  INTERNAL_SERVER_ERROR: {
    name: 'Internal Server Error',
    code: 500,
  },
  NOT_IMPLEMENTED: {
    name: 'Not Implemented',
    code: 501,
  },
  BAD_GATEWAY: {
    name: 'Bad Gateway',
    code: 502,
  },
  SERVER_UNAVAILABLE: {
    name: 'Server Unavailable',
    code: 503,
  },
  GATEWAY_TIMEOUT: {
    name: 'Gateway Timeout',
    code: 504,
  },
  HTTP_VERSION_NOT_SUPPORTED: {
    name: 'HTTP Version Not Supported',
    code: 505,
  },
  VARIANT_ALSO_NEGOTIATES: {
    name: 'Variant Also Negotiates',
    code: 506,
  },
  INSUFFICIENT_STORAGE: {
    name: 'Insufficient Storage',
    code: 507,
  },
  LOOP_DETECTED: {
    name: 'Loop Detected',
    code: 508,
  },
  NOT_EXTENDED: {
    name: 'Not Extended',
    code: 510,
  },
  NETWORK_AUTHENTICATION_REQUIRED: {
    name: 'Network Authentication Required',
    code: 511,
  },
} as const;
export type HTTPStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];
export type HTTPStatusCode =
  (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS]['code'];
