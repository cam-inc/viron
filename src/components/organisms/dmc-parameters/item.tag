dmc-parameter-item.ParameterItem(class="{ isInfoOpened ? 'ParameterItem--infoOpened' : '' } { isBodyOpened ? 'ParameterItem--bodyOpened' : '' }")
  .ParameterItem__head
    .ParameterItem__caption
      .ParameterItem__bodyOpenShutButton(ref="touch" onTap="handleBodyOpenShutButtonTap")
        dmc-icon(type="right")
      .ParameterItem__idx(ref="touch" onTap="handleIdxTap") [{ opts.idx }]
      .ParameterItem__line
      .ParameterItem__removeButton(ref="touch" onTap="handleRemoveButtonTap")
        dmc-icon(type="minusCircle")
      .ParameterItem__infoOpenShutButton(ref="touch" onTap="handleInfoOpenShutButtonTap")
        dmc-icon(type="infoCirlceO")
    .ParameterItem__info
      .ParameterItem__type type: { type }
  .ParameterItem__body
    virtual(if="{ isSchemaMode }")
      dmc-parameter-schema(val="{ opts.val || {} }" schemaObject="{ itemsObject }" onChange="{ handleSchemaChange }")
    virtual(if="{ !isSchemaMode }")
      dmc-parameter-form(val="{ opts.val }" schemaObject="{ itemsObject }" onChange="{ handleFormChange }")

  script.
    import '../../atoms/dmc-icon/index.tag';
    import './form.tag';
    import './schema.tag';
    import script from './item';
    this.external(script);
