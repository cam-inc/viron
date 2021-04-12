import { MODE_MYSQL, MODE_MONGO } from './constants';

class VironError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const noSetEnvMode = (): VironError => {
  return new VironError(
    `The environment variable is not set. key=MODE, value=${MODE_MONGO} or ${MODE_MYSQL}`
  );
};

export const unauthorized = (): VironError => {
  return new VironError('Unauthorized', 401);
};
