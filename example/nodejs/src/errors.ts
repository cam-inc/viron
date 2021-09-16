import { MODE } from './constants';
import { VironError } from '@viron/lib';
import { MulterError } from 'multer';

export const noSetEnvMode = (): VironError => {
  return new VironError(
    `The environment variable is not set. key=MODE, value=${MODE.MONGO} or ${MODE.MYSQL}`
  );
};

export const notFound = (): VironError => {
  return new VironError('NotFound', 404);
};

export const uploadMulterError = (error: MulterError): VironError => {
  return new VironError(
    `Multer Media Upload Failed. name: ${error.name}, message:${error.message}`
  );
};
