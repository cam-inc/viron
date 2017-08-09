dmc-parameter-property.ParameterProperty
  .ParameterProperty__head
    div property
  .ParameterProperty__body
    dmc-parameter-schema(val="{ opts.val }" schemaObject="{ schemaObject }" onChange="{ handleSchemaChange }")

  script.
    import script from './property';
    this.external(script);
