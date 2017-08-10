dmc-parameter.Parameter(class="{ isInfoOpened ? 'Parameter--infoOpened' : '' } { isBodyOpened ? 'Parameter--bodyOpened' : '' }")
  .Parameter__head
    .Parameter__caption
      .Parameter__bodyOpenShutButton(ref="touch" onTap="handleBodyOpenShutButtonTap")
        dmc-icon(type="right")
      .Parameter__name(ref="touch" onTap="handleNameTap") { name }
      .Parameter__line
      .Parameter__required(if="{ required }") required
      .Parameter__infoOpenShutButton(ref="touch" onTap="handleInfoOpenShutButtonTap")
        dmc-icon(type="infoCirlceO")
    .Parameter__info
      .Parameter__description(if="{ !!description }") description: { description }
      .Parameter__in in: { _in }
      .Parameter__type(if="{ !!type }") type: { type }
  .Parameter__body
    virtual(if="{ isFormMode }")
      dmc-parameter-form(val="{ opts.val }" parameterObject="{ parameterObject }" onChange="{ handleFormChange }")
    virtual(if="{ isSchemaMode }")
      dmc-parameter-schema(val="{ opts.val }" schemaObject="{ schemaObject }" onChange="{ handleSchemaChange }")
    virtual(if="{ isItemsMode }")
      dmc-parameter-items(val="{ opts.val }" name="{ itemsName }" itemsObject="{ itemsObject }" onChange="{ handleItemsChange }")

  script.
    import '../../atoms/dmc-icon/index.tag';
    import './form.tag';
    import './items.tag';
    import './schema.tag';
    import script from './parameter';
    this.external(script);
