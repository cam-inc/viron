import contains from 'mout/array/contains';
import forEach from 'mout/array/forEach';
import forOwn from 'mout/object/forOwn';
import get from 'mout/object/get';

/**
 * Swaggerファイルをロードして解析しデータ/操作を一元管理。
 * Tips: swagger-client(swagger-js) は、ブラウザの外部ファイル読み込み
 */
class Swagger {
  constructor() {
    this.client = null;
  }

  setup(endpoint) {
    return new Promise((resolve, reject) => {
      const request = {
        url: endpoint.url,
        //query,
        //method,
        //body,
        headers: {
          'Authorization': endpoint.token
        },
        requestInterceptor: (req) => {
          console.log('Interceptor(request):', req);
        },
        responseInterceptor: (res) => {
          console.log('Interceptor(response):', res);
        }
      };

      SwaggerClient// eslint-disable-line no-undef
        .http(request)
        .then(client => {
          if (client.errors && client.errors.length > 0) {
            return reject(client.errors);
          }
          if (client.status === 401) {
            // TODO: 要確認。
            const err = new Error();
            err.name = '401 Authorization Required';
            err.status = client.spec.status;
            return reject(err);
          }

          console.log(`[fetch] ${client.url} success.`);

          SwaggerClient({spec: client.body}).then((_client) => {// eslint-disable-line no-undef
            this.client = _client;
            resolve(_client.spec.info);
          });
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  apisFlatObject() {
    if (!this.client) {
      return {};
    }
    const apis = {};
    forOwn(this.client.apis, (v) => {
      forOwn(v, (v1, k1) => {
        apis[k1] = v1;
      });
    });

    return apis;
  }

  getApiByOperationID(operationID) {
    return this.apisFlatObject()[operationID];
  }

  getOperationObjectByOperationID(operationID) {
    let operationObject;
    forOwn(this.client.spec.paths, pathItemObject => {
      forOwn(pathItemObject, v => {
        if (get(v, 'operationId') === operationID) {
          operationObject = v;
        }
      });
    });
    return operationObject;
  }

  getPathItemObjectByPath(path) {
    return this.client.spec.paths[path];
  }

  getMethodAndPathByOperationID(operationID) {
    const ret = {};
    forOwn(this.client.spec.paths, (pathItemObject, path) => {
      forOwn(pathItemObject, (v, k) => {
        if (get(v, 'operationId') === operationID) {
          ret.method = k;
          ret.path = path;
        }
      });
    });
    return ret;
  }

  /**
   * dmc-component-*.tagが扱いやすいデータ構造に変換する。
   * @param {Object} schema
   * @param {*} response
   */
  mergeSchemaAndResponse(schema, response) {
    // @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.25
    // type will be one of "null", "boolean", "object", "array", "number", "string" or "integer".
    let type = schema.type;
    // if type is not defined or an array, expect type by response.
    if (!type || Array.isArray(type)) {
      if (Array.isArray(response)) {
        type = 'array';
      } else {
        type = typeof response;
      }
    }
    const ret = {
      // dmc customs.
      _type: null,
      _value: null,
      _rawValue: null,
      _index: null,
      _key: null,
      _keys: null,
      _length: null,
      getType: function() {
        return this._type;
      },
      getValue: function(k) {
        if (k === undefined) {
          return this._value;
        }
        return this._value[k];
      },
      getRawValue: function() {
        return this._rawValue;
      },
      getIndex: function() {
        return this._index;
      },
      getKey: function() {
        return this._key;
      },
      getKeys: function() {
        return this._keys;
      },
      getLength: function() {
        return this._length;
      }
    };
    // @see: http://swagger.io/specification/#schemaObject
    const schemaObjectKeys = [
      'example',
      'format',// @see: http://swagger.io/specification/#dataTypeFormat
      'title',
      'description',
      'default',
      'multipleOf',
      'maximum',
      'exclusiveMaximum',
      'minimum',
      'exclusiveMinimum',
      'maxLength',
      'minLength',
      'pattern',
      'maxItems',
      'minItems',
      'uniqueItems',
      'maxProperties',
      'minProperties',
      'required',
      'enum',
      //'type',// removed on purpose. type will be customized by dmc.
      'items',
      'allOf',
      'properties',
      'additionalProperties'
    ];
    forEach(schemaObjectKeys, v => {
      ret[`_${v}`] = schema[v];
      ret[`get${v.charAt(0).toUpperCase()}${v.slice(1)}`] = function() {
        return this[`_${v}`];
      };
    });

    switch (type) {
    case 'null':
      ret._type = 'null';
      ret._value = null;
      ret._rawValue = null;
      break;
    case 'boolean':
      ret._type = 'boolean';
      ret._value = response;
      ret._rawValue = response;
      break;
    case 'object':
      ret._type = 'object';
      ret._value = {};
      ret._rawValue = response;
      ret._keys = [];
      forOwn(response, (v, k) => {
        ret._keys.push(k);
        let nextSchema;
        if (!!schema.properties) {
          nextSchema = schema.properties[k];
        } else if (schema.additionalProperties) {
          nextSchema = {};
        } else {
          // TODO: swagger定義が間違っているので警告を出す。
        }
        ret._value[k] = this.mergeSchemaAndResponse(nextSchema, v);
        ret._value[k]._key = k;
      });
      break;
    case 'array':
      ret._type = 'array';
      ret._value = [];
      ret._rawValue = response;
      ret._length = response.length;
      forEach(response, (v, i) => {
        ret._value[i] = this.mergeSchemaAndResponse(schema.items, v);
        ret._value[i]._index = i;
      });
      break;
    case 'number':
      ret._type = 'number';
      ret._value = response;
      ret._rawValue = response;
      break;
    case 'string':
      ret._type = 'string';
      ret._value = response;
      ret._rawValue = response;
      break;
    case 'integer':
      ret._type = 'integer';
      ret._value = response;
      ret._rawValue = response;
      break;
    default:
      // irregular case. e.g.) レスポンス内容がproperties内に定義されていない場合など。
      ret._value = response;
      ret._rawValue = response;
      break;
    }

    return ret;
  }

  isComponentStyleNumber(style) {
    return style === 'number';
  }

  isComponentStyleTable(style) {
    return style === 'table';
  }

  isComponentStyleGraph(style) {
    return contains([
      'graph-bar',
      'graph-scatterplot',
      'graph-line',
      'graph-horizontal-bar',
      'graph-stacked-bar',
      'graph-horizontal-stacked-bar',
      'graph-stacked-area'
    ], style);
  }

  isComponentStyleGraphBar(style) {
    return style === 'graph-bar';
  }

  isComponentStyleGraphScatterplot(style) {
    return style === 'graph-scatterplot';
  }

  isComponentStyleGraphLine(style) {
    return style === 'graph-line';
  }

  isComponentStyleGraphHorizontalBar(style) {
    return style === 'graph-horizontal-bar';
  }

  isComponentStyleGraphStackedBar(style) {
    return style === 'graph-stacked-bar';
  }

  isComponentStyleGraphHorizontalStackedBar(style) {
    return style === 'graph-horizontal-stacked-bar';
  }

  isComponentStyleGraphStackedArea(style) {
    return style === 'graph-stacked-area';
  }

}

export default new Swagger();
