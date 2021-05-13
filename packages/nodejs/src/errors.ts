export const repositoryUninitialized = (): Error => {
  return new Error(`Uninitialized repository is not available`);
};

export const roleIdAlreadyExists = (): Error => {
  return new Error('The role-id is already exists.');
};
