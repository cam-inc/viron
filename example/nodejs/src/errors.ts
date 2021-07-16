import { MODE } from './constants';
import { VironError } from '@viron/lib';

export const noSetEnvMode = (): VironError => {
  return new VironError(
    `The environment variable is not set. key=MODE, value=${MODE.MONGO} or ${MODE.MYSQL}`
  );
};

export const notFound = (): VironError => {
  return new VironError('NotFound', 404);
};
