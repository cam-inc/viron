/* eslint-disable */
import semverGte from 'semver/functions/gte';
import semverLte from 'semver/functions/lte';
import semverValid from 'semver/functions/valid';
import { Document } from '$types/oas';

export const isBrowser: boolean = typeof window !== 'undefined';
export const isSSR: boolean = typeof window === 'undefined';

export const timeout = async (ms: number): Promise<undefined> => {
  return await new Promise((resolve) => setTimeout(resolve, ms));
};

// Check whether a OAS document is support by us.
export const isOASSupported = function (document: Document): boolean {
  if (!semverValid(document.openapi)) {
    return false;
  }
  if (!semverGte(document.openapi, '3.0.0')) {
    return false;
  }
  if (!semverLte(document.openapi, '3.0.2')) {
    return false;
  }
  return true;
};

// Promise wrapper for easy async/await error handling.
// @see: https://dev.to/sobiodarlington/better-error-handling-with-async-await-2e5m
export const promiseErrorHandler = async function <T>(
  promise: Promise<T>
): Promise<[T, Error | null]> {
  let res: T | null = null;
  let err: Error | null = null;
  try {
    res = await promise.then((res) => res);
  } catch (_err) {
    err = _err;
  }
  return [res as T, err as Error];
};
