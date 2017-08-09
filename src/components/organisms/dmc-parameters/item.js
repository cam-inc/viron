import ObjectAssign from 'object-assign';

export default function() {
  // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#itemsObject
  const schemaObject = ObjectAssign({}, this.opts.schemaobject);

  // TODO: 入力データ変更時にはthis.opts.idxと共に親に渡す。
}
