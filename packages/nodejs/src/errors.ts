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

export const repositoryInitializationError = (): VironError => {
  return new VironError(`Either Db Conneciton or Config is required.`, 400);
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

export const invalidOidcToken = (): VironError => {
  return new VironError('Invalid OIDC Token.', 400);
};

export const googleOAuth2Unavailable = (): VironError => {
  return new VironError('Google OAuth2 is unavailable.', 500);
};

export const oidcUnavailable = (): VironError => {
  return new VironError('OIDC is unavailable.', 500);
};

export const mismatchState = (): VironError => {
  return new VironError('State is mismatch.', 400);
};

export const oasValidationFailure = (): VironError => {
  return new VironError('OAS validation failure.', 500);
};

export const unableToDeleteRole = (): VironError => {
  return new VironError('Unable to Delete Role.', 400);
};

export const operationNotFound = (): VironError => {
  return new VironError('Operation Not Found.', 404);
};

export const invalidAuthType = (): VironError => {
  return new VironError('Invalid Auth type.', 400);
};

export const unsupportedScope = (): VironError => {
  return new VironError('Unsupported scope.', 500);
};
