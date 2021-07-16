import _ from 'lodash';
import { RegisterOptions, Validate } from 'react-hook-form';
import { Schema } from '$types/oas';

export const getRegisterOptions = function ({
  required,
  schema,
}: {
  required: boolean;
  schema: Schema;
}): RegisterOptions {
  const options: RegisterOptions = {};
  options.validate = {};
  // required.
  if (required) {
    options.validate.required = getValidateRequired();
  }
  // multipleOf
  if (schema.multipleOf) {
    if (['number', 'integer'].includes(schema.type))
      options.validate.required = getValidateMultipleOf(schema.multipleOf);
  }
  // maximum
  if (_.isNumber(schema.maximum)) {
    if (['number', 'integer'].includes(schema.type))
      options.validate.required = getValidateMaximum(
        schema.maximum,
        schema.exclusiveMaximum
      );
  }
  return options;
};

const getValidateRequired = function (): Validate<any> {
  return function (data) {
    if (_.isUndefined(data)) {
      return `Required.`;
    }
    if (data === '') {
      return `Required.`;
    }
    return true;
  };
};

// @see: https://datatracker.ietf.org/doc/html/draft-wright-json-schema-validation-00#section-5.1
const getValidateMultipleOf = function (
  multipleOf: NonNullable<Schema['multipleOf']>
): Validate<number> {
  return function (data) {
    if (data % multipleOf !== 0) {
      return `${data} should be dividable by ${multipleOf}.`;
    }
    return true;
  };
};

// @see: https://datatracker.ietf.org/doc/html/draft-wright-json-schema-validation-00#section-5.2
// @see: https://datatracker.ietf.org/doc/html/draft-wright-json-schema-validation-00#section-5.3
const getValidateMaximum = function (
  maximum: NonNullable<Schema['maximum']>,
  exclusiveMaximum: Schema['exclusiveMaximum']
): Validate<number> {
  return function (data) {
    if (exclusiveMaximum) {
      if (maximum <= data) {
        return `${data} should be less than ${maximum}.`;
      }
    } else {
      if (maximum < data) {
        return `${data} should be less than or equal to ${maximum}.`;
      }
    }
    return true;
  };
};
