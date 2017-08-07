dmc-parameter.Parameter
  .Parameter__head
    .Parameter__name name: { name }
    .Parameter__in in: { _in }
    .Parameter__description description: { description }
    .Parameter__required required: { required ? '必須' : 'not必須' }
    .Parameter__type type: { type }
  virtual(if="{ !isSchemaMode }")
    dmc-parameter-form(if="{ isSingleForm }" val="{ opts.val }" parameterObject="{ parameterObject }" onChange="{ handleChange }")
  virtual(if="{ isSchemaMode }")
    dmc-parameter-schema(schemaObject="{ schema }")

  script.
    import './form.tag';
    import './schema.tag';
    import script from './parameter';
    this.external(script);
