dmc-parameter-schema.ParameterSchema
  .ParameterSchema__head
    .ParameterSchema__caption
      .ParameterSchema__name { name }
    .ParameterSchema__info
      .ParameterSchema__type type: { type }
  .ParameterSchema__body
    virtual(if="{ isFormMode }")
      dmc-parameter-form(val="{ opts.val }" schemaObject="{ schemaObject }" onChange="{ handleFormChange }")
    virtual(if="{ isPropertiesMode }")
      dmc-parameter-properties(val="{ opts.val }" properties="{ properties }" _required="{ required }" onChange="{ handlePropertiesChange }")
    virtual(if="{ isItemsMode }")
      dmc-parameter-items(val="{ opts.val }" name="{ itemsName }" itemsObject="{ itemsObject }" onChange="{ handleItemsChange }")

  script.
    import './form.tag';
    import './items.tag';
    import './properties.tag';
    import script from './schema';
    this.external(script);
