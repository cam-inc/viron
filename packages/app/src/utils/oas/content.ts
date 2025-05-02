import _ from 'lodash';
import { BaseError, OASError, Result, Success, Failure } from '@/errors';
import { Document } from '@/types/oas';

export const validateResponseDataOfTypeNumber = (
  document: Document,
  responseData: any
): Result<number, OASError> => {
  const responseKey = document.info['x-number']?.responseKey;
  if (!responseKey) {
    return new Failure(new OASError('Response key is not specified.'));
  }
  const value = responseData?.[responseKey];
  if (!_.isNumber(value)) {
    return new Failure(new BaseError('data should be of type object.'));
  }
  return new Success(value);
};
