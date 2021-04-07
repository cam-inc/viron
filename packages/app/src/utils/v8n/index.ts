import _ from 'lodash';
import { string as yupString } from 'yup';

export const endpointId = yupString().min(1).max(64);
export const email = yupString().email();
// TODO: Support localhost.
//export const url = yup.string().url();
export const url = yupString();

/*
export const oasSchema = function (
  schema: Schema,
  { required = false }: { required?: boolean } = {}
): BaseSchema {
  let s: BaseSchema;
  switch (schema.type) {
    case 'string':
      s = yupString();
      break;
    case 'number':
      s = yupNumber();
      break;
    case 'integer':
      s = yupNumber().integer();
      break;
    case 'object':
      s = yupObject();
      _.forEach(schema.properties, function (_schema, _name) {
        s = s.shape({
          [_name]: oasSchema(_schema as Schema, {
            required: (schema.required || []).includes(_name),
          }),
        });
      });
      break;
    case 'array':
      s = yupArray();
      break;
    case 'boolean':
      s = yupBoolean();
      break;
    default:
      throw new Error(`type of ${schema.type} not supported.`);
  }
  if (required) {
    s = s.required();
  }
  return s;
};
*/
/*
export const oasParameter = function (parameter: Parameter): BaseSchema {
  if (!!parameter.content) {
    throw new Error(
      '`content` property in parameter object is not supported yet.'
    );
  }
  return oasSchema(parameter.schema as Schema, {
    required: parameter.required,
  });
};
*/
/*
export const oasRequestBody = function (requestBody: RequestBody): BaseSchema {
  const contentType = pickContentType(requestBody.content);
  const mediaType = requestBody.content[contentType];
  return oasSchema(mediaType.schema as Schema, {
    required: requestBody.required,
  });
};
*/
