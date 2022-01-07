import _ from 'lodash';
import { RequestPayloadParameter, Style } from '~/types/oas';

type Variable = RequestPayloadParameter['value'];

// @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#style-values
// @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#style-examples
export const serialize = function (
  name: string,
  variable: Variable,
  style: Style,
  explode = false
): string {
  switch (style) {
    /*
  case 'matrix':
    return serializeMatrix(variable, explode);
  case 'label':
    return serializeLabel(variable, explode);
    */
    case 'form':
      return serializeForm(name, variable, explode);
    case 'simple':
      return serializeSimple(variable, explode);
    /*
  case 'spaceDelimited':
    return serializeSpaceDelimited(variable, explode);
  case 'pipeDelimited':
    return serializePipeDelimited(variable, explode);
  case 'deepObject':
    return serializeDeepObject(variable, explode);
    */
    default:
      break;
  }
  return variable as string;
};
/*
export const serializeMatrix = function (
  variable: Variable,
  explode: boolean
): string {
  // TODO
  return variable;
};

export const serializeLabel = function (
  variable: Variable,
  explode: boolean
): string {
  // TODO
  return variable;
};
*/

export const serializeForm = function (
  name: string,
  variable: Variable,
  explode: boolean
): string {
  if (_.isNumber(variable)) {
    return `${name}=${variable.toString()}`;
  }
  if (_.isString(variable)) {
    return `${name}=${variable}`;
  }
  if (_.isArray(variable)) {
    if (explode) {
      return variable
        .map((v) => {
          if (_.isNumber(v)) {
            return v.toString();
          }
          return `${name}=${v}`;
        })
        .join('&');
    } else {
      return `${name}=${variable
        .map((v) => {
          if (_.isNumber(v)) {
            return v.toString();
          }
          return v;
        })
        .join(',')}`;
    }
  }
  if (_.isObject(variable)) {
    if (explode) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return _.map(variable, function (val: any, key) {
        if (_.isNumber(val)) {
          val = val.toString();
        }
        return `${key}=${val}`;
      }).join('&');
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return `${name}=${_.map(variable, function (val: any, key) {
        if (_.isNumber(val)) {
          val = val.toString();
        }
        return `${key},${val}`;
      }).join(',')}`;
    }
  }
  return variable;
};

// @see: https://tools.ietf.org/html/rfc6570#section-3.2.2
export const serializeSimple = function (
  variable: Variable,
  explode: boolean
): string {
  if (_.isNumber(variable)) {
    return variable.toString();
  }
  if (_.isString(variable)) {
    return variable;
  }
  if (_.isArray(variable)) {
    return variable
      .map((v) => {
        if (_.isNumber(v)) {
          return v.toString();
        }
        return v;
      })
      .join(',');
  }
  if (_.isObject(variable)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return _.map(variable, function (val: any, key) {
      if (_.isNumber(val)) {
        val = val.toString();
      }
      if (explode) {
        return `${key}=${val}`;
      } else {
        return `${key},${val}`;
      }
    }).join(',');
  }
  return variable;
};
/*
export const serializeSpaceDelimited = function (
  variable: Variable,
  explode: boolean
): string {
  // TODO
  return variable;
};

export const serializePipeDelimited = function (
  variable: Variable,
  explode: boolean
): string {
  // TODO
  return variable;
};

export const serializeDeepObject = function (
  variable: Variable,
  explode: boolean
): string {
  // TODO
  return variable;
};
*/
