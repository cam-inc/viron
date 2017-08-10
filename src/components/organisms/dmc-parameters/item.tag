dmc-parameter-item.ParameterItem
  .ParameterItem__head
    div item { opts.idx }
  .ParameterItem__body
    virtual(if="{ isSchemaMode }")
      dmc-parameter-schema(val="{ opts.val || {} }" schemaObject="{ itemsObject }" onChange="{ handleSchemaChange }")
    virtual(if="{ !isSchemaMode }")
      dmc-parameter-form(val="{ opts.val }" parameterObject="{ itemsObject }" onChange="{ handleFormChange }")

  script.
    import './form.tag';
    import './schema.tag';
    import script from './item';
    this.external(script);
