import { MODE_MYSQL, MODE_MONGO } from './constants';
import { VironError } from '@viron/lib';

export const noSetEnvMode = (): VironError => {
  return new VironError(
    `The environment variable is not set. key=MODE, value=${MODE_MONGO} or ${MODE_MYSQL}`
  );
};

export const notFound = (): VironError => {
  return new VironError('NotFound', 404);
};
