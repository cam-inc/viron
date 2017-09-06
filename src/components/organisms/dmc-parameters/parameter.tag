dmc-parameter.Parameter
  .Parameter__body
    dmc-parameter-schema(val="{ opts.val }" schemaObject="{ normalizedSchemaObject }" additionalInfo="{ opts.additionalinfo }" onChange="{ handleSchemaChange }")

  script.
    import './schema.tag';
    import script from './parameter';
    this.external(script);
