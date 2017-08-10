dmc-parameter-schema.ParameterSchema
  .ParameterSchema__body
    virtual(if="{ isFormMode }")
      dmc-parameter-form(val="{ opts.val }" parameterObject="{ schemaObject }" onChange="{ handleFormChange }")
    virtual(if="{ isPropertiesMode }")
      dmc-parameter-properties(val="{ opts.val }" properties="{ properties }" required="{ required }" onChange="{ handlePropertiesChange }")
    virtual(if="{ isItemsMode }")
      dmc-parameter-items(val="{ opts.val }" itemsObject="{ itemsObject }" onChange="{ handleItemsChange }")

  script.
    import './form.tag';
    import './items.tag';
    import './properties.tag';
    import script from './schema';
    this.external(script);
