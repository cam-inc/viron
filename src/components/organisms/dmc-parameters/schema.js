import ObjectAssign from 'object-assign';

export default function() {
  const schemaObject = ObjectAssign({}, this.opts.schemaobject);
  // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schema-object
  this.title = schemaObject.title;
  this.description = schemaObject.description;
  this.required = schemaObject.required;
  this.type = schemaObject.type;
}
