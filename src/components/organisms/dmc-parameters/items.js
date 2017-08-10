import ObjectAssign from 'object-assign';

export default function() {
  // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#itemsObject
  const itemsObject = ObjectAssign({}, this.opts.itemsobject);
  this.name = this.opts.name;
  this.itemsObject = itemsObject;
  this.type = itemsObject.type;
  this.items = itemsObject.items;
  // 自身を再帰的にを生成する必要があるか否か。
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

  /**
   * 指定idxに対応するユーザ入力値を返却します。
   * @param {Number} idx
   * @return {*}
   */
  this.getItemValue = idx => {
    let value = this.opts.val[idx];
    // nullも値として有効なので`undefined`だけを対象とする。
    if (value === undefined) {
      if (this.type === 'array') {
        value = [];
      } else {
        // 明示的に`undefined`を設定。
        value = undefined;
      }
    }
    return value;
  };

  // infoの開閉状態。
  this.isInfoOpened = false;
  // bodyの開閉状態。
  this.isBodyOpened = true;

  // infoの開閉ボタンがタップされた時の処理。
  this.handleInfoOpenShutButtonTap = () => {
    this.isInfoOpened = !this.isInfoOpened;
    this.update();
  };

  // bodyの開閉ボタンがタップされた時の処理。
  this.handleBodyOpenShutButtonTap = () => {
    this.isBodyOpened = !this.isBodyOpened;
    this.update();
  };

  // nameがタップされた時の処理。
  this.handleNameTap = () => {
    this.isBodyOpened = !this.isBodyOpened;
    this.update();
  };

  // +ボタンがタップされた時の処理。
  this.handleAddButtonTap = () => {
    const arr = this.opts.val.concat([]);
    // undefinedを追加することで空の入力フォームを出力できる。
    arr.push(undefined);
    this.opts.onchange(arr, this.opts.idx);
  };

  // -ボタンがタップされた時の処理。
  this.handleRemoveButtonTap = () => {
    this.opts.onremove(this.opts.idx);
  };

  // item(s)から削除依頼を受け取った時の処理。
  this.handleItemRemove = idx => {
    const arr = this.opts.val.concat([]);
    // undefinedを追加することで空の入力フォームを出力できる。
    arr.splice(idx, 1);
    this.opts.onchange(arr, this.opts.idx);
  };

  // item(s)が変更された時の処理。
  this.handleItemChange = (newValue, idx) => {
    // cloneする。
    const arr = this.opts.val.concat([]);
    arr[idx] = newValue;
    this.opts.onchange(arr, this.opts.idx);
  };
}
