dmc-parameter-schema.ParameterSchema(class="{ isInfoOpened ? 'ParameterSchema--infoOpened' : '' } { isBodyOpened ? 'ParameterSchema--bodyOpened' : '' }")
  .ParameterSchema__head
    .ParameterSchema__caption
      .ParameterSchema__title { title }
      .ParameterSchema__infoOpenShutButton(ref="touch" onTap="handleInfoOpenShutButtonTap")
        dmc-icon(type="infoCirlceO")
      .ParameterSchema__bodyOpenShutButton(ref="touch" onTap="handleBodyOpenShutButtonTap")
        dmc-icon(type="up")
    .ParameterSchema__info
      .ParameterSchema__description(if="{ discription }") description: { description }
      .ParameterSchema__format(if="{ format }") format: { format }
      .ParameterSchema__type type: { type }
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
