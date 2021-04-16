import Ajv, { ValidateFunction } from 'ajv';
import schema from './schema.json';

export const lint = function(document: object): { isValid: boolean; errors: ValidateFunction['errors'] } {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const isValid = validate(document);
  return {
    isValid: isValid as boolean,
    errors: validate.errors
  };
};
