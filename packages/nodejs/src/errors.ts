export class VironError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const repositoryUninitialized = (): Error => {
  return new VironError(`Uninitialized repository is not available`, 500);
};

export const jwtUninitialized = (): Error => {
  return new VironError(`Uninitialized jwt is not available`, 500);
};

export const roleIdAlreadyExists = (): Error => {
  return new VironError('The role-id is already exists.', 400);
};

export const signinFailed = (): Error => {
  return new VironError('Signin failed', 400);
};

export const unauthorized = (): VironError => {
  return new VironError('Unauthorized', 401);
};
