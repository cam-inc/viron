import { isSSR } from '$utils/index';

export const ON = {
  PRIMARY: 'primary',
  PRIMARY_CONTAINER: 'primaryContainer',
  SECONDARY: 'secondary',
  SECONDARY_CONTAINER: 'secondaryContainer',
  TERTIARY: 'tertiary',
  TERTIARY_CONTAINER: 'tertiaryContainer',
  ERROR: 'error',
  ERROR_CONTAINER: 'errorContainer',
  BACKGROUND: 'background',
  SURFACE: 'surface',
  SURFACE_VARIANT: 'surfaceVariant',
} as const;
export type On = typeof ON[keyof typeof ON];

export const URL = {
  DOCUMENTATION: 'https://discovery.viron.app/docs/',
  BLOG: 'https://discovery.viron.app/blog/',
  RELEASE_NOTES: 'https://viron.app/TODO/release_notes/',
  HELP: 'https://viron.app/TODO/help/',
  GITHUB: 'https://github.com/cam-inc/viron/',
  TWITTER: 'https://twitter.com/TODO',
} as const;
export type Url = typeof URL[keyof typeof URL];

export const ENVIRONMENTAL_VARIABLE = {
  AUTOCOMPLETE_VALUE: '${autocompleteValue}',
  OAUTH_REDIRECT_URI: '${oauthRedirectURI}',
} as const;
export type EnvironmentalVariable =
  typeof ENVIRONMENTAL_VARIABLE[keyof typeof ENVIRONMENTAL_VARIABLE];

export const OAUTH_REDIRECT_URI = (function () {
  if (isSSR) {
    return '';
  }
  return `${window.location.origin}/oauthredirect`;
})();

export const HTTP_STATUS_CODE = {
  CONTINUE: 100,
  SWITCHING_PROTOCOL: 101,
  PROCESSING: 102,
  EARLY_HINTS: 103,
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NON_AUTHORITATIVE_INFORMATION: 203,
  NO_CONTENT: 204,
  RESET_CONTENT: 205,
  PARTIAL_CONTENT: 206,
  MULTI_STATUS: 207,
  ALREADY_REPORTED: 208,
  IM_USED: 226,
  MULTIPLE_CHOICE: 300,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  SEE_OTHER: 303,
  NOT_MODIFIED: 304,
  TEMPORARY_REDIRECT: 307,
  PERMANENT_REDIRECT: 308,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  IM_A_TEAPOT: 418,
  MISDIRECTED_REQUEST: 421,
  UNPROCESSABLE_ENTITY: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  TOO_EARLY: 425,
  UPGRADE_REQUIRED: 426,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVER_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  VARIANT_ALSO_NEGOTIATES: 506,
  INSUFFICIENT_STORAGE: 507,
  LOOP_DETECTED: 508,
  NOT_EXTENDED: 510,
  NETWORK_AUTHENTICATION_REQUIRED: 511,
} as const;
export type HTTPStatusCode =
  typeof HTTP_STATUS_CODE[keyof typeof HTTP_STATUS_CODE];

export const HTTP_STATUS: Record<
  HTTPStatusCode,
  { name: string; message: string }
> = {
  100: {
    name: 'Continue',
    message: 'TODO',
  },
  101: {
    name: 'Swithing Protocols',
    message: 'TODO',
  },
  102: {
    name: 'Processing',
    message: 'TODO',
  },
  103: {
    name: 'Early Hints',
    message: 'TODO',
  },
  200: {
    name: 'OK',
    message: 'TODO',
  },
  201: {
    name: 'Created',
    message: 'TODO',
  },
  202: {
    name: 'Accepted',
    message: 'TODO',
  },
  203: {
    name: 'Non-Authoritative information',
    message: 'TODO',
  },
  204: {
    name: 'No Content',
    message: 'TODO',
  },
  205: {
    name: 'Reset Content',
    message: 'TODO',
  },
  206: {
    name: 'Partial Content',
    message: 'TODO',
  },
  207: {
    name: 'Multi Status',
    message: 'TODO',
  },
  208: {
    name: 'Already Reported',
    message: 'TODO',
  },
  226: {
    name: 'IM Used',
    message: 'TODO',
  },
  300: {
    name: 'Multiple Choice',
    message: 'TODO',
  },
  301: {
    name: 'Moved Permanently',
    message: 'TODO',
  },
  302: {
    name: 'Found',
    message: 'TODO',
  },
  303: {
    name: 'See Other',
    message: 'TODO',
  },
  304: {
    name: 'Not Modified',
    message: 'TODO',
  },
  307: {
    name: 'Temporary Redirect',
    message: 'TODO',
  },
  308: {
    name: 'Permanent Redirect',
    message: 'TODO',
  },
  400: {
    name: 'Bad Request',
    message:
      'The request could not be understood by the server due to malformed request payload syntax.',
  },
  401: {
    name: 'Unauthorized',
    message: 'TODO',
  },
  402: {
    name: 'Payment Required',
    message: 'TODO',
  },
  403: {
    name: 'Forbidden',
    message: 'TODO',
  },
  404: {
    name: 'Not Found',
    message: 'TODO',
  },
  405: {
    name: 'Method Not Allowed',
    message: 'TODO',
  },
  406: {
    name: 'Not Acceptable',
    message: 'TODO',
  },
  407: {
    name: 'Proxy Authentication Required',
    message: 'TODO',
  },
  408: {
    name: 'Request Timeout',
    message: 'TODO',
  },
  409: {
    name: 'Conflict',
    message: 'TODO',
  },
  410: {
    name: 'Gone',
    message: 'TODO',
  },
  411: {
    name: 'Length Required',
    message: 'TODO',
  },
  412: {
    name: 'Precondition Failed',
    message: 'TODO',
  },
  413: {
    name: 'Payload Too Large',
    message: 'TODO',
  },
  414: {
    name: 'URI Too Long',
    message: 'TODO',
  },
  415: {
    name: 'Unsupportedd Media Type',
    message: 'TODO',
  },
  416: {
    name: 'Range Not Satisfiable',
    message: 'TODO',
  },
  417: {
    name: 'Expectation Failed',
    message: 'TODO',
  },
  418: {
    name: 'Im a Teapot',
    message: 'TODO',
  },
  421: {
    name: 'Misdirected Request',
    message: 'TODO',
  },
  422: {
    name: 'Unprocessable Entity',
    message: 'TODO',
  },
  423: {
    name: 'Locked',
    message: 'TODO',
  },
  424: {
    name: 'Failed Dependency',
    message: 'TODO',
  },
  425: {
    name: 'Too Early',
    message: 'TODO',
  },
  426: {
    name: 'Upgrade Required',
    message: 'TODO',
  },
  428: {
    name: 'Precondition Required',
    message: 'TODO',
  },
  429: {
    name: 'Too Many Requests',
    message: 'TODO',
  },
  431: {
    name: 'Request Header Fields Too Large',
    message: 'TODO',
  },
  451: {
    name: 'Unavailable For Legal Reasons',
    message: 'TODO',
  },
  500: {
    name: 'Internal Server Error',
    message: 'TODO',
  },
  501: {
    name: 'Not Implemented',
    message: 'TODO',
  },
  502: {
    name: 'Bad Gateway',
    message: 'TODO',
  },
  503: {
    name: 'Server Unavailable',
    message: 'TODO',
  },
  504: {
    name: 'Gateway Timeout',
    message: 'TODO',
  },
  505: {
    name: 'HTTP Version Not Supported',
    message: 'TODO',
  },
  506: {
    name: 'Variant Also Negotiates',
    message: 'TODO',
  },
  507: {
    name: 'Insufficient Storage',
    message: 'TODO',
  },
  508: {
    name: 'Loop Detected',
    message: 'TODO',
  },
  510: {
    name: 'Not Extended',
    message: 'TODO',
  },
  511: {
    name: 'Network Authentication Required',
    message: 'TODO',
  },
} as const;
export type HTTPStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];
