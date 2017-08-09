import ObjectAssign from 'object-assign';

export default function() {
  // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#itemsObject
  const itemsObject = ObjectAssign({}, this.opts.itemsobject);
  this.itemsObject = itemsObject;

  // formが変更された時の処理。
  this.handleFormChange = newValue => {
    this.opts.onchange(newValue, this.opts.idx);
  };

  // TODO: 入力データ変更時にはthis.opts.idxと共に親に渡す。
  // TODOtypeを確認する
}
