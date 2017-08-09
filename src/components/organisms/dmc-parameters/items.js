import ObjectAssign from 'object-assign';

export default function() {
  // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#itemsObject
  const itemsObject = ObjectAssign({}, this.opts.itemsobject);
  this.type = itemsObject.type;
  this.items = itemsObject.items;
  // プラス/マイナスボタンで任意に数を調整して作成された入力データ群。
  this.itemsParameters = [];
  // 再帰的にフォームを生成する必要があるか否か。
  this.isRecursive = false;
  // The value MUST be one of "string", "number", "integer", "boolean", or "array". Files and models are not allowed.
  switch (this.type) {
  case 'string':
  case 'number':
  case 'integer':
  case 'boolean':
    this.isRecursive = false;
    break;
  case 'array':
    this.isRecursive = true;
    break;
  default:
    // ここに処理が来ることは無い。
    break;
  }
}
