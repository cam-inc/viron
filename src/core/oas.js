import contains from 'mout/array/contains';
import hasOwn from 'mout/object/hasOwn';
import ObjectAssign from 'object-assign';

export default {
  /**
   * PropertyObjectと他情報を元にSchemaObjectを生成します。
   * @param {Object} propertyObject
   * @param {Object} params
   * @return {Object}
   */
  createSchemaObjectFromPropertyObject: (propertyObject, params) => {
    const normalizedSchemaObject = ObjectAssign({}, propertyObject);
    // nameが未設定であれば、propertyObjectのkeyを使用する。
    if (!normalizedSchemaObject.name && !!params.key) {
      normalizedSchemaObject.name = params.key;
    }
    // requiredが未設定であれば、required配列内存在確認を行う。
    if (!hasOwn(normalizedSchemaObject, 'required') && Array.isArray(params.required) && !!params.required.length) {
      normalizedSchemaObject.required = contains(params.required, params.key);
    }
    return normalizedSchemaObject;
  }
};
