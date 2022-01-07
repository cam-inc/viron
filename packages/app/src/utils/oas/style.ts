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
    case 'matrix':
      return serializeMatrix(name, variable, explode);
    case 'label':
      return serializeLabel(variable, explode);
    case 'form':
      return serializeForm(name, variable, explode);
    case 'simple':
      return serializeSimple(variable, explode);
    case 'spaceDelimited':
      return serializeSpaceDelimited(variable);
    case 'pipeDelimited':
      return serializePipeDelimited(variable);
    case 'deepObject':
      return serializeDeepObject(name, variable);
    default:
      break;
  }
  return variable as string;
};

export const serializeMatrix = function (
  name: string,
  variable: Variable,
  explode: boolean
): string {
  if (_.isString(variable)) {
    if (_.isEmpty(variable)) {
      return `;${name}`;
    }
    return `;${name}=${variable}`;
  }
  if (_.isNumber(variable)) {
    return `;${name}=${variable.toString()}`;
  }
  if (_.isBoolean(variable)) {
    return `;${name}=${variable.toString()}`;
  }
  if (_.isObject(variable)) {
    if (_.isEmpty(variable)) {
      return `;${name}`;
    }
    if (explode) {
      return (
        ';' +
        Object.entries(variable)
          .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
          .join(';')
      );
    } else {
      return (
        `;${name}=` +
        Object.entries(variable)
          .map(([key, value]) => `${key},${JSON.stringify(value)}`)
          .join(',')
      );
    }
  }
  if (_.isArray(variable)) {
    if (_.isEmpty(variable)) {
      return `;${name}`;
    }
    if (explode) {
      return (
        ';' +
        variable.map((value) => `${name}=${JSON.stringify(value)}`).join(';')
      );
    } else {
      return (
        `;${name}=` +
        variable.map((value) => `${JSON.stringify(value)}`).join(',')
      );
    }
  }
  throw new Error('TODO');
};

export const serializeLabel = function (
  variable: Variable,
  explode: boolean
): string {
  if (_.isString(variable)) {
    if (_.isEmpty(variable)) {
      return '.';
    }
    return `.${variable}`;
  }
  if (_.isNumber(variable)) {
    if (_.isEmpty(variable)) {
      return '.';
    }
    return `.${variable.toString()}`;
  }
  if (_.isBoolean(variable)) {
    return `.${variable.toString()}`;
  }
  if (_.isObject(variable)) {
    if (_.isEmpty(variable)) {
      return `.`;
    }
    if (explode) {
      return (
        '.' +
        Object.entries(variable)
          .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
          .join('.')
      );
    } else {
      return (
        '.' +
        Object.entries(variable)
          .map(([key, value]) => `${key}.${JSON.stringify(value)}`)
          .join('.')
      );
    }
  }
  if (_.isArray(variable)) {
    if (_.isEmpty(variable)) {
      return `.`;
    }
    return '.' + variable.map((value) => `${JSON.stringify(value)}`).join('.');
  }
  throw new Error('TODO');
};

export const serializeForm = function (
  name: string,
  variable: Variable,
  explode: boolean
): string {
  if (_.isString(variable)) {
    return `${name}=${variable}`;
  }
  if (_.isNumber(variable)) {
    return `${name}=${variable.toString()}`;
  }
  if (_.isBoolean(variable)) {
    return `${name}=${variable.toString()}`;
  }
  if (_.isObject(variable)) {
    if (_.isEmpty(variable)) {
      return `${name}=`;
    }
    if (explode) {
      return Object.entries(variable)
        .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
        .join('&');
    } else {
      return (
        `${name}=` +
        Object.entries(variable)
          .map(([key, value]) => `${key},${JSON.stringify(value)}`)
          .join(',')
      );
    }
  }
  if (_.isArray(variable)) {
    if (_.isEmpty(variable)) {
      return `${name}=`;
    }
    if (explode) {
      return variable
        .map((value) => `${name}=${JSON.stringify(value)}`)
        .join('&');
    } else {
      return (
        `${name}=` +
        variable.map((value) => `${JSON.stringify(value)}`).join(',')
      );
    }
  }
  throw new Error('TODO');
};

// @see: https://tools.ietf.org/html/rfc6570#section-3.2.2
export const serializeSimple = function (
  variable: Variable,
  explode: boolean
): string {
  if (_.isString(variable)) {
    if (_.isEmpty(variable)) {
      throw new Error('TODO');
    }
    return variable;
  }
  if (_.isNumber(variable)) {
    return variable.toString();
  }
  if (_.isBoolean(variable)) {
    return variable.toString();
  }
  if (_.isObject(variable)) {
    if (_.isEmpty(variable)) {
      throw new Error('TODO');
    }
    if (explode) {
      return Object.entries(variable)
        .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
        .join(',');
    } else {
      return Object.entries(variable)
        .map(([key, value]) => `${key},${JSON.stringify(value)}`)
        .join(',');
    }
  }
  if (_.isArray(variable)) {
    if (_.isEmpty(variable)) {
      throw new Error('TODO');
    }
    return variable.map((value) => `${JSON.stringify(value)}`).join(',');
  }
  throw new Error('TODO');
};

export const serializeSpaceDelimited = function (variable: Variable): string {
  if (_.isString(variable) || _.isNumber(variable) || _.isBoolean(variable)) {
    throw new Error('TODO');
  }
  if (_.isObject(variable)) {
    if (_.isEmpty(variable)) {
      throw new Error('TODO');
    }
    return Object.entries(variable)
      .map(([key, value]) => `${key}%20${JSON.stringify(value)}`)
      .join('%20');
  }
  if (_.isArray(variable)) {
    if (_.isEmpty(variable)) {
      throw new Error('TODO');
    }
    return variable.map((value) => `${JSON.stringify(value)}`).join('%20');
  }
  throw new Error('TODO');
};

export const serializePipeDelimited = function (variable: Variable): string {
  if (_.isString(variable) || _.isNumber(variable) || _.isBoolean(variable)) {
    throw new Error('TODO');
  }
  if (_.isObject(variable)) {
    if (_.isEmpty(variable)) {
      throw new Error('TODO');
    }
    return Object.entries(variable)
      .map(([key, value]) => `${key}|${JSON.stringify(value)}`)
      .join('|');
  }
  if (_.isArray(variable)) {
    if (_.isEmpty(variable)) {
      throw new Error('TODO');
    }
    return variable.map((value) => `${JSON.stringify(value)}`).join('|');
  }
  throw new Error('TODO');
};

export const serializeDeepObject = function (
  name: string,
  variable: Variable
): string {
  if (_.isString(variable) || _.isNumber(variable) || _.isBoolean(variable)) {
    throw new Error('TODO');
  }
  if (_.isObject(variable)) {
    if (_.isEmpty(variable)) {
      throw new Error('TODO');
    }
    return Object.entries(variable)
      .map(([key, value]) => `${name}[${key}]=${JSON.stringify(value)}`)
      .join('&');
  }
  if (_.isArray(variable)) {
    throw new Error('TODO');
  }
  throw new Error('TODO');
};
