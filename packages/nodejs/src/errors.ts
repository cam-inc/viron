export class VironError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const repositoryUninitialized = (): VironError => {
  return new VironError(`Uninitialized repository is not available`, 500);
};

export const jwtUninitialized = (): VironError => {
  return new VironError(`Uninitialized jwt is not available`, 500);
};

export const roleIdAlreadyExists = (): VironError => {
  return new VironError('The role-id is already exists.', 400);
};

export const signinFailed = (): VironError => {
  return new VironError('Signin failed', 400);
};

export const unauthorized = (): VironError => {
  return new VironError('Unauthorized', 401);
};

export const forbidden = (): VironError => {
  return new VironError('Forbidden', 403);
};

export const adminUserNotFound = (): VironError => {
  return new VironError('Admin User not found.', 404);
};

export const oasUndefined = (): VironError => {
  return new VironError('OAS is undefined.', 404);
};

export const invalidGoogleOAuth2Token = (): VironError => {
  return new VironError('Invalid Google OAuth2 Token.', 400);
};

export const googleOAuth2Unavailable = (): VironError => {
  return new VironError('Google OAuth2 is unavailable.', 500);
};

export const mismatchState = (): VironError => {
  return new VironError('State is mismatch.', 400);
};
