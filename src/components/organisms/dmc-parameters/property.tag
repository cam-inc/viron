dmc-parameter-property.ParameterProperty(class="{ isInfoOpened ? 'ParameterProperty--infoOpened' : '' } { isBodyOpened ? 'ParameterProperty--bodyOpened' : '' }")
  .ParameterProperty__head
    .ParameterProperty__caption
      .ParameterProperty__key { key }
      .ParameterProperty__infoOpenShutButton(ref="touch" onTap="handleInfoOpenShutButtonTap")
        dmc-icon(type="infoCirlceO")
      .ParameterProperty__bodyOpenShutButton(ref="touch" onTap="handleBodyOpenShutButtonTap")
        dmc-icon(type="up")
    .ParameterProperty__info
      .ParameterProperty__type type: { type }
      .ParameterProperty__description(if="{ discription }") description: { description }
      .ParameterProperty__example(if="{ example }") example: { example }
  .ParameterProperty__body
    dmc-parameter-schema(val="{ opts.val }" schemaObject="{ schemaObject }" onChange="{ handleSchemaChange }")

  script.
    import script from './property';
    this.external(script);
