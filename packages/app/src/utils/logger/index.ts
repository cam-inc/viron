const LEVEL = {
  TRACE: 'trace', // 10
  DEBUG: 'debug', //20
  INFO: 'info', //30
  WARN: 'warn', //40
  ERROR: 'error', //50
  FATAL: 'fatal', //60
} as const;
type Level = typeof LEVEL[keyof typeof LEVEL];
export const NAMESPACE = {
  GENERAL: 'general',
  REACT_COMPONENT: 'reactComponent',
} as const;
type Namespace = typeof NAMESPACE[keyof typeof NAMESPACE];
type Payload = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages: any[];
  namespace?: Namespace;
};

const log = function (
  level: Level,
  namespace: Namespace,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages: any[]
): void {
  // There is no function named `fatal` in Console interface so just use error function instead.
  if (level === LEVEL.FATAL) {
    console.error(`[${level}][${namespace}]: `, ...messages);
  } else {
    console[level](`[${level}][${namespace}]: `, ...messages);
  }
};

export const trace = function ({
  messages,
  namespace = NAMESPACE.GENERAL,
}: Payload): void {
  log(LEVEL.TRACE, namespace, messages);
};

export const debug = function ({
  messages,
  namespace = NAMESPACE.GENERAL,
}: Payload): void {
  log(LEVEL.DEBUG, namespace, messages);
};

export const info = function ({
  messages,
  namespace = NAMESPACE.GENERAL,
}: Payload): void {
  log(LEVEL.INFO, namespace, messages);
};

export const warn = function ({
  messages,
  namespace = NAMESPACE.GENERAL,
}: Payload): void {
  log(LEVEL.WARN, namespace, messages);
};

export const error = function ({
  messages,
  namespace = NAMESPACE.GENERAL,
}: Payload): void {
  log(LEVEL.ERROR, namespace, messages);
};

export const fatal = function ({
  messages,
  namespace = NAMESPACE.GENERAL,
}: Payload): void {
  log(LEVEL.FATAL, namespace, messages);
};
