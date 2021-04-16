import { lint } from '@viron/linter';
import { URL } from '$types/index';
import { Document } from '$types/oas';

export const isBrowser: boolean = typeof window !== 'undefined';
export const isSSR: boolean = typeof window === 'undefined';

export const isRelativeURL = function (url: URL): boolean {
  return url[0] !== 'h';
};

export const timeout = async (ms: number): Promise<undefined> => {
  return await new Promise((resolve) => setTimeout(resolve, ms));
};

// Check whether a OAS document is support by us.
export const isOASSupported = function (document: Document) {
  return lint(document);
};

// Promise wrapper for easy async/await error handling.
// @see: https://dev.to/sobiodarlington/better-error-handling-with-async-await-2e5m
export const promiseErrorHandler = async function <T, E = Error>(
  promise: Promise<T>
): Promise<[T, E | null]> {
  let res: T | null = null;
  let err: E | null = null;
  try {
    res = await promise.then((res) => res);
  } catch (_err) {
    err = _err;
  }
  return [res as T, err as E];
};
