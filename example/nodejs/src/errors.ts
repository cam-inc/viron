import { modeMongo, modeMysql } from './constant';

class VironError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const noSetEnvMode = (): VironError => {
  return new VironError(
    `The environment variable is not set. key=MODE, value=${modeMongo} or ${modeMysql}`
  );
};

export const unauthorized = (): VironError => {
  return new VironError('Unauthorized', 401);
};
