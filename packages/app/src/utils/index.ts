/* eslint-disable */
export const isBrowser: boolean = typeof window !== 'undefined';

export const timeout = async (ms: number): Promise<undefined> => {
  return await new Promise((resolve) => setTimeout(resolve, ms));
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
