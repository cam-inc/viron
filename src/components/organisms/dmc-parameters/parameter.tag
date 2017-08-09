dmc-parameter.Parameter
  .Parameter__head
    .Parameter__name name: { name }
    .Parameter__in in: { _in }
    .Parameter__description description: { description }
    .Parameter__required required: { required ? '必須' : 'not必須' }
    .Parameter__type type: { type }
  virtual(if="{ !isSchemaMode }")
    virtual(if="{ isSingleMode }")
      dmc-parameter-form(val="{ opts.val }" parameterObject="{ parameterObject }" onChange="{ handleParameterChange }")
    virtual(if="{ isMultiMode }")
      dmc-parameter-items(val="{ opts.val }" itemsObject="{ items }")
  virtual(if="{ isSchemaMode }")
    dmc-parameter-schema(val="{ opts.val }" schemaObject="{ schema }")

  script.
    import './form.tag';
    import './items.tag';
    import './schema.tag';
    import script from './parameter';
    this.external(script);
