import Ajv, { ValidateFunction } from 'ajv';
import jsonSchemaDraft04 from 'ajv/lib/refs/json-schema-draft-04.json';
import schema from './schemas/3.0.x.json';

export const lint = function(document: object): { isValid: boolean; errors: ValidateFunction['errors'] } {
  const ajv = new Ajv({
    schemaId: 'auto',
    format: 'full',
    coerceTypes: true,
    unknownFormats: 'ignore',
    useDefaults: true,
    nullable: true,
  });
  ajv.addMetaSchema(jsonSchemaDraft04);
  const validate = ajv.compile(schema);
  const isValid = validate(document);
  return {
    isValid: isValid as boolean,
    errors: validate.errors
  };
};
