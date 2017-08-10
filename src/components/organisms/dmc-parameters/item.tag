dmc-parameter-item.ParameterItem
  .ParameterItem__head
    .ParameterItem__idx item { opts.idx }
    .ParameterItem__removeButton(ref="touch" onTap="handleRemoveButtonTap")
      dmc-icon(type="minus")
  .ParameterItem__body
    virtual(if="{ isSchemaMode }")
      dmc-parameter-schema(val="{ opts.val || {} }" schemaObject="{ itemsObject }" onChange="{ handleSchemaChange }")
    virtual(if="{ !isSchemaMode }")
      dmc-parameter-form(val="{ opts.val }" parameterObject="{ itemsObject }" onChange="{ handleFormChange }")

  script.
    import '../../atoms/dmc-icon/index.tag';
    import './form.tag';
    import './schema.tag';
    import script from './item';
    this.external(script);
