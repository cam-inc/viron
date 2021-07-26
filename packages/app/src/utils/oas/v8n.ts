import _ from 'lodash';
import { RegisterOptions, Validate } from 'react-hook-form';
import { Schema } from '$types/oas';
import { email } from '$utils/v8n';

export const getRegisterOptions = function ({
  required,
  schema,
}: {
  required: boolean;
  schema: Schema;
}): RegisterOptions {
  const options: RegisterOptions = {
    setValueAs: setValueAs(schema),
  };
  options.validate = {};
  // required.
  if (required) {
    options.validate.selfRequired = getValidateSelfRequired();
  }
  // multipleOf
  if (schema.multipleOf) {
    if (['number', 'integer'].includes(schema.type))
      options.validate.multipleOf = getValidateMultipleOf(schema.multipleOf);
  }
  // maximum
  if (_.isNumber(schema.maximum)) {
    if (['number', 'integer'].includes(schema.type))
      options.validate.maximum = getValidateMaximum(
        schema.maximum,
        schema.exclusiveMaximum
      );
  }
  // minimum
  if (_.isNumber(schema.minimum)) {
    if (['number', 'integer'].includes(schema.type))
      options.validate.minimum = getValidateMinimum(
        schema.minimum,
        schema.exclusiveMinimum
      );
  }
  // maxLength
  if (_.isNumber(schema.maxLength)) {
    if (['string'].includes(schema.type)) {
      options.validate.maxLength = getValidateMaxLength(schema.maxLength);
    }
  }
  // minLength
  if (_.isNumber(schema.minLength)) {
    if (['string'].includes(schema.type)) {
      options.validate.minLength = getValidateMinLength(schema.minLength);
    }
  }
  // pattern
  if (schema.pattern) {
    if (['string'].includes(schema.type)) {
      options.validate.pattern = getValidatePattern(schema.pattern);
    }
  }
  // maxItems
  if (_.isNumber(schema.maxItems)) {
    if (['array'].includes(schema.type)) {
      options.validate.maxItems = getValidateMaxItems(schema.maxItems);
    }
  }
  // minItems
  if (_.isNumber(schema.minItems)) {
    if (['array'].includes(schema.type)) {
      options.validate.minItems = getValidateMinItems(schema.minItems);
    }
  }
  // uniqueIetms
  if (schema.uniqueItems) {
    if (['array'].includes(schema.type)) {
      options.validate.uniqueItems = getValidateUniqueItems();
    }
  }
  // maxProperties
  if (_.isNumber(schema.maxProperties)) {
    if (['object'].includes(schema.type)) {
      options.validate.maxProperties = getValidateMaxProperties(
        schema.maxProperties
      );
    }
  }
  // minProperties
  if (_.isNumber(schema.minProperties)) {
    if (['object'].includes(schema.type)) {
      options.validate.minProperties = getValidateMinProperties(
        schema.minProperties
      );
    }
  }
  // required
  if (schema.required) {
    if (['object'].includes(schema.type)) {
      options.validate.required = getValidateRequired(schema.required);
    }
  }
  // additionalProperties
  if (!_.isUndefined(schema.additionalProperties)) {
    if (['object'].includes(schema.type)) {
      options.validate.additionalProperties = getValidateAdditionalProperties(
        schema.additionalProperties,
        schema.properties
      );
    }
  }
  // enum
  if (schema.enum) {
    options.validate.enum = getValidateEnum(schema.enum, schema.type);
  }
  // type
  if (schema.type) {
    options.validate.type = getValidateType(schema.type);
  }
  // allOf
  if (schema.allOf) {
    options.validate.allOf = getValidateAllOf(schema.allOf);
  }
  // anyOf
  if (schema.anyOf) {
    options.validate.anyOf = getValidateAnyOf(schema.anyOf);
  }
  // oneOf
  if (schema.oneOf) {
    options.validate.oneOf = getValidateOneOf(schema.oneOf);
  }
  // not
  if (schema.not) {
    options.validate.not = getValidateNot(schema.not);
  }
  // format
  if (schema.format) {
    options.validate.format = getValidateFormat(schema.format, schema.type);
  }
  return options;
};

export const setValueAs = function (
  schema: Schema
): NonNullable<RegisterOptions['setValueAs']> {
  return function (value) {
    if (schema.type === 'integer') {
      return parseInt(value);
    }
    if (schema.type === 'number') {
      return Number(value);
    }
    return value;
  };
};

export const getValidateSelfRequired = function (): Validate<any> {
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
export const getValidateMultipleOf = function (
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
export const getValidateMaximum = function (
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

// @see: https://datatracker.ietf.org/doc/html/draft-wright-json-schema-validation-00#section-5.4
// @see: https://datatracker.ietf.org/doc/html/draft-wright-json-schema-validation-00#section-5.5
export const getValidateMinimum = function (
  minimum: NonNullable<Schema['minimum']>,
  exclusiveMinimum: Schema['exclusiveMinimum']
): Validate<number> {
  return function (data) {
    if (exclusiveMinimum) {
      if (data <= minimum) {
        return `${data} should be greater than ${minimum}.`;
      }
    } else {
      if (data < minimum) {
        return `${data} should be greater than or equal to ${minimum}.`;
      }
    }
    return true;
  };
};

// @see: https://datatracker.ietf.org/doc/html/draft-wright-json-schema-validation-00#section-5.6
export const getValidateMaxLength = function (
  maxLength: NonNullable<Schema['maxLength']>
): Validate<string> {
  return function (data) {
    if (maxLength < data.length) {
      return `The length should be less than or equal to ${maxLength}`;
    }
    return true;
  };
};

// @see: https://datatracker.ietf.org/doc/html/draft-wright-json-schema-validation-00#section-5.7
export const getValidateMinLength = function (
  minLength: NonNullable<Schema['minLength']>
): Validate<string> {
  return function (data) {
    if (data.length < minLength) {
      return `The length should be greater than or equal to ${minLength}`;
    }
    return true;
  };
};

// @see: https://datatracker.ietf.org/doc/html/draft-wright-json-schema-validation-00#section-5.8
export const getValidatePattern = function (
  pattern: NonNullable<Schema['pattern']>
): Validate<string> {
  return function (data) {
    if (!new RegExp(pattern).test(data)) {
      return `The pattern ${pattern} should match.`;
    }
    return true;
  };
};

// @see: https://datatracker.ietf.org/doc/html/draft-wright-json-schema-validation-00#section-5.10
export const getValidateMaxItems = function (
  maxItems: NonNullable<Schema['maxItems']>
): Validate<any[]> {
  return function (data) {
    if (maxItems < data.length) {
      return `The length should be less than or equal to ${maxItems}`;
    }
    return true;
  };
};

// @see: https://datatracker.ietf.org/doc/html/draft-wright-json-schema-validation-00#section-5.11
export const getValidateMinItems = function (
  minItems: NonNullable<Schema['minItems']>
): Validate<any[]> {
  return function (data) {
    if (data.length < minItems) {
      return `The length should be greater than or equal to ${minItems}`;
    }
    return true;
  };
};

// @see: https://datatracker.ietf.org/doc/html/draft-wright-json-schema-validation-00#section-5.12
export const getValidateUniqueItems = function (): Validate<any[]> {
  return function (data) {
    if (data.length !== _.uniq(data).length) {
      return `All items should be unique.`;
    }
    return true;
  };
};

// @see: https://datatracker.ietf.org/doc/html/draft-wright-json-schema-validation-00#section-5.13
export const getValidateMaxProperties = function (
  maxProperties: NonNullable<Schema['maxProperties']>
): Validate<Record<string, any>> {
  return function (data) {
    if (maxProperties < _.size(data)) {
      return `The length should be less than or equal to ${maxProperties}`;
    }
    return true;
  };
};

// @see: https://datatracker.ietf.org/doc/html/draft-wright-json-schema-validation-00#section-5.14
export const getValidateMinProperties = function (
  minProperties: NonNullable<Schema['minProperties']>
): Validate<Record<string, any>> {
  return function (data) {
    if (_.size(data) < minProperties) {
      return `The length should be greater than or equal to ${minProperties}`;
    }
    return true;
  };
};

// @see: https://datatracker.ietf.org/doc/html/draft-wright-json-schema-validation-00#section-5.15
export const getValidateRequired = function (
  required: NonNullable<Schema['required']>
): Validate<Record<string, any>> {
  return function (data) {
    const remainings = [...required];
    _.remove(remainings, function (item) {
      return _.keys(data).includes(item);
    });
    if (remainings.length) {
      return `${remainings[0]} is required.`;
    }
    return true;
  };
};

// TODO: patternPropertiesをサポートすべきか否か。

// @see: https://datatracker.ietf.org/doc/html/draft-wright-json-schema-validation-00#section-5.18
export const getValidateAdditionalProperties = function (
  additionalProperties: NonNullable<Schema['additionalProperties']>,
  properties: Schema['properties']
): Validate<Record<string, any>> {
  return function (data) {
    // Always valid.
    if (additionalProperties === true) {
      return true;
    }
    // If "additionalProperties" is false, validation succeeds only if the instance is an object and all properties on the instance were covered by "properties".
    if (additionalProperties === false) {
      if (!properties) {
        if (_.keys(data).length) {
          return `Data should be empty object.`;
        }
      } else {
        const remainings = _.keys(data);
        _.remove(remainings, function (item) {
          return _.keys(properties).includes(item);
        });
        if (remainings.length) {
          return `${remainings[0]} is not allowed to be included in data.`;
        }
      }
    }
    if (typeof additionalProperties === 'object') {
      // TODO:
    }
    return true;
  };
};

// @see: https://datatracker.ietf.org/doc/html/draft-wright-json-schema-validation-00#section-5.20
export const getValidateEnum = function (
  _enum: NonNullable<Schema['enum']>,
  type: Schema['type']
): Validate<any> {
  return function (data) {
    switch (type) {
      case 'integer':
      case 'number':
      case 'string':
      case 'boolean':
        if (_enum.includes(data)) {
          return true;
        }
        break;
      case 'object':
      case 'array':
        if (
          _enum
            .map(function (item) {
              return JSON.stringify(item);
            })
            .includes(JSON.stringify(data))
        ) {
          return true;
        }
    }
    return `Should be one of ${JSON.stringify(_enum)}.`;
  };
};

// @see: https://datatracker.ietf.org/doc/html/draft-wright-json-schema-validation-00#section-5.21
// @see: https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.2.md#properties
export const getValidateType = function (type: Schema['type']): Validate<any> {
  return function (data) {
    if (type === 'integer') {
      if (!_.isInteger(data)) {
        return `Should be type of integer.`;
      }
    }
    if (type === 'number') {
      if (!_.isNumber(data)) {
        return `Should be type of number.`;
      }
    }
    if (type === 'string') {
      if (!_.isString(data)) {
        return `Should be type of string.`;
      }
    }
    if (type === 'boolean') {
      if (!_.isBoolean(data)) {
        return `Should be type of boolean.`;
      }
    }
    if (type === 'object') {
      if (!_.isObject(data)) {
        return `Should be type of object.`;
      }
    }
    if (type === 'array') {
      if (!_.isArray(data)) {
        return `Should be type of array.`;
      }
    }
    return true;
  };
};

// @see: https://datatracker.ietf.org/doc/html/draft-wright-json-schema-validation-00#section-5.22
export const getValidateAllOf = function (
  allOf: NonNullable<Schema['allOf']>
): Validate<any> {
  return function (data) {
    // TODO
    return true;
  };
};

// @see: https://datatracker.ietf.org/doc/html/draft-wright-json-schema-validation-00#section-5.23
export const getValidateAnyOf = function (
  anyOf: NonNullable<Schema['anyOf']>
): Validate<any> {
  return function (data) {
    // TODO
    return true;
  };
};

// @see: https://datatracker.ietf.org/doc/html/draft-wright-json-schema-validation-00#section-5.24
export const getValidateOneOf = function (
  oneOf: NonNullable<Schema['oneOf']>
): Validate<any> {
  return function (data) {
    // TODO
    return true;
  };
};

// @see: https://datatracker.ietf.org/doc/html/draft-wright-json-schema-validation-00#section-5.25
export const getValidateNot = function (
  not: NonNullable<Schema['not']>
): Validate<any> {
  return function (data) {
    // TODO
    return true;
  };
};

// @see: https://datatracker.ietf.org/doc/html/draft-wright-json-schema-validation-00#section-7
export const getValidateFormat = function (
  format: NonNullable<Schema['format']>,
  type: Schema['type']
): Validate<any> {
  if (type === 'string') {
    if (format === 'wyswyg') {
      return function (data: string) {
        const _data = JSON.parse(data) as Record<string, any>;
        // @see: https://editorjs.io/saving-data#output-data-format
        if (
          _.isUndefined(_data.time) ||
          _.isUndefined(_data.blocks) ||
          _.isUndefined(_data.version)
        ) {
          return 'Should be of Editor.js output data format.';
        }
        return true;
      };
    }
    if (format === 'email') {
      return function (data: string) {
        if (!email.isValidSync(data)) {
          return `Should be an e-mail string.`;
        }
        return true;
      };
    }
    if (format === 'hostname') {
      return function (data: string) {
        // @see: https://datatracker.ietf.org/doc/html/draft-wright-json-schema-validation-00#section-7.3.3
        // @see: https://datatracker.ietf.org/doc/html/rfc1034#section-3.1
        if (
          !new RegExp(
            '^[a-zd]([a-zd-]{0,61}[a-zd])?(.[a-zd]([a-zd-]{0,61}[a-zd])?)*$',
            'i'
          ).test(data)
        ) {
          return `Should be a hostname string.`;
        }
        if (255 < data.length) {
          return `Should be a hostname string.`;
        }
        return true;
      };
    }
    if (format === 'ipv4') {
      return function (data: string) {
        if (
          !new RegExp(
            '^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
          ).test(data)
        ) {
          return `Should be a IP v4 string.`;
        }
        return true;
      };
    }
    if (format === 'ipv6') {
      return function (data: string) {
        if (
          !new RegExp(
            '(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))'
          ).test(data)
        ) {
          return `Should be a IP v6string.`;
        }
        return true;
      };
    }
  }

  return function (data) {
    // TODO
    return true;
  };
};
