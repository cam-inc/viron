export const isBrowser: boolean = typeof window !== 'undefined';

export const timeout = async (ms: number): Promise<undefined> => {
  return await new Promise((resolve) => setTimeout(resolve, ms));
};
