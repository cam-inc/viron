import roarr, { Message, ROARR } from 'roarr';
import { JsonStringifiable } from '$types/index';

const LEVEL = {
  TRACE: 10,
  DEBUG: 20,
  INFO: 30,
  WARN: 40,
  ERROR: 50,
  FATAL: 60,
} as const;
type Level = typeof LEVEL[keyof typeof LEVEL];
const NAMESPACE = {
  GENERAL: 'general',
} as const;
type Namespace = typeof NAMESPACE[keyof typeof NAMESPACE];
type Context = {
  level: Level;
  namespace: Namespace;
};

ROARR.write = function (message) {
  const payload = JSON.parse(message) as Message;
  console.log(payload);
};

const log = function (
  level: Level,
  namespace: Namespace,
  message: JsonStringifiable
) {
  const context: Context = {
    level,
    namespace,
  };
  // The second argument is there to output some immutable properties.
  roarr(context, JSON.stringify(message, Object.getOwnPropertyNames(message)));
};

export const trace = function ({
  message,
  namespace = NAMESPACE.GENERAL,
}: {
  message: JsonStringifiable;
  namespace?: Namespace;
}) {
  log(LEVEL.TRACE, namespace, message);
};

export const debug = function ({
  message,
  namespace = NAMESPACE.GENERAL,
}: {
  message: JsonStringifiable;
  namespace?: Namespace;
}) {
  log(LEVEL.DEBUG, namespace, message);
};

export const info = function ({
  message,
  namespace = NAMESPACE.GENERAL,
}: {
  message: JsonStringifiable;
  namespace?: Namespace;
}) {
  log(LEVEL.INFO, namespace, message);
};

export const warn = function ({
  message,
  namespace = NAMESPACE.GENERAL,
}: {
  message: JsonStringifiable;
  namespace?: Namespace;
}) {
  log(LEVEL.WARN, namespace, message);
};

export const error = function ({
  message,
  namespace = NAMESPACE.GENERAL,
}: {
  message: JsonStringifiable;
  namespace?: Namespace;
}) {
  log(LEVEL.ERROR, namespace, message);
};

export const fatal = function ({
  message,
  namespace = NAMESPACE.GENERAL,
}: {
  message: JsonStringifiable;
  namespace?: Namespace;
}) {
  log(LEVEL.FATAL, namespace, message);
};
