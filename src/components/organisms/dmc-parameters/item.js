import ObjectAssign from 'object-assign';

export default function() {
  // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#itemsObject
  const itemsObject = ObjectAssign({}, this.opts.itemsobject);
  this.itemsObject = itemsObject;
  this.type = itemsObject.type;
  // OAS仕様上はtypeに`object`が格納されることは無いが、利便性を高めるために`object`への対応を特別に行う。
  // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#itemsObject
  this.isSchemaMode = (this.type === 'object');

  // infoの開閉状態。
  this.isInfoOpened = false;
  // bodyの開閉状態。
  this.isBodyOpened = false;

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
  this.handleIdxTap = () => {
    this.isBodyOpened = !this.isBodyOpened;
    this.update();
  };

  // -ボタンがタップされた時の処理。
  this.handleRemoveButtonTap = () => {
    this.opts.onremove(this.opts.idx);
  };

  // schemaが変更された時の処理。
  this.handleSchemaChange = newValue => {
    this.opts.onchange(newValue, this.opts.idx);
  };

  // formが変更された時の処理。
  this.handleFormChange = newValue => {
    this.opts.onchange(newValue, this.opts.idx);
  };
}
