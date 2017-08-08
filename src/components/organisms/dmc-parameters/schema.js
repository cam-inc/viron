import ObjectAssign from 'object-assign';

export default function() {
  const schemaObject = ObjectAssign({}, this.opts.schemaobject);
  // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schema-object
  this.title = schemaObject.title;
  this.description = schemaObject.description;
  this.required = schemaObject.required;
  this.type = schemaObject.type;
  // NOTE: JSON Schema仕様上typeにintergerを設定できないが、goaモジュールはintegerを設定している。(i.e. JSON Schemaを拡張している)。クライアントサイドではintegerをnumberとして扱う。
  // OAS2.0仕様ではtypeはJSON Schemaのtypeと同じ。
  if (this.type === 'integer') {
    this.type = 'number';
  }

  // TODO: allOf対応が必要か調べること。
  // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#composition-and-inheritance-polymorphism
  // TODO: keywordごとにvalidate対象typeが存在するので注意。
  // @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.4.1

  // 単一フォームか複数か。
  this.isSingleForm = true;
  // @see: http://json-schema.org/latest/json-schema-core.html#rfc.section.4.2
  switch (this.type) {
  case 'null':
  case 'boolean':
  case 'object':
    // TODO: "properties", "patternProperties", and "additionalProperties", dependencies
    break;
  case 'array':
    // TODO: "items" and "additionalItems"
    break;
  case 'number':
    // @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.1
    // TODO: multipleOf
    // @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.2
    // TODO: maxmum
    break;
  case 'string':
    break;
  default:
    // JSON Schema仕様拡張時にここに到達するがサポートしない。
    break;
  }

  /**
   * JSON Schema仕様に則って入力チェックを行います。
   * @return {Object} e.g.){ isValid:bool, message:string }
   */
  this.validate = () => {
    const result = {
      isValid: true,
      message: ''
    };

    switch (this.type) {
    case 'null':
    case 'boolean':
    case 'object':
      // TODO: required, minProperties, maxProperties, propertyNames, dependencies
      break;
    case 'array':
      // TODO: minItems, maxItems, uniqueItems contains
      break;
    case 'number':
    case 'string':
      break;
    default:
      // JSON Schemaは自由に拡張して良いので
      break;
    }

    return result;
  };
}
