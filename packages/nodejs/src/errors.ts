export const repositoryUninitialized = (): Error => {
  return new Error(`Uninitialized repository is not available`);
};
