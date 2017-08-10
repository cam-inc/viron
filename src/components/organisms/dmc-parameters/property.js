import ObjectAssign from 'object-assign';

export default function() {
  const schemaObject = ObjectAssign({}, this.opts.property);
  this.schemaObject = schemaObject;
  this.key = this.opts.key;
  this.type = schemaObject.type;
  this.description = schemaObject.description;
  this.example = schemaObject.example;

  // infoの開閉状態。
  this.isInfoOpened = false;
  // bodyの開閉状態。
  this.isBodyOpened = true;

  // infoの開閉ボタンがタップされた時の処理。
  this.handleInfoOpenShutButtonTap = () => {
    this.isInfoOpened = !this.isInfoOpened;
    this.update();
  };

  // infoの開閉ボタンがタップされた時の処理。
  this.handleBodyOpenShutButtonTap = () => {
    this.isBodyOpened = !this.isBodyOpened;
    this.update();
  };

  // schemaが変更された時の処理。
  this.handleSchemaChange = newValue => {
    this.opts.onchange(newValue, this.opts.key);
  };
}
