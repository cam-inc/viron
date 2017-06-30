dmc-operation-parameter.Operation__parameter
  .Operation__parameterHead
    div
      .Operation__parameterName name: { opts.parameter.name }
      .Operation__parameterDescription description: { opts.parameter.description }
      .Operation__parameterIn in: { opts.parameter.in }
    .Operation__parameterRequired(if="{ opts.parameter.required }") required
  .Operation__parameterBody
    dmc-operation-schema(if="{ isUseBody }" name="{ opts.parameter.name}" schema="{ opts.parameter.schema }" parameterValues="{ opts.parametervalue }" onChange="{ handleChange }")
    dmc-operation-parameter-form(if="{ !isUseBody }" parameterObject="{ this.opts.parameter }" parameterValue="{ opts.parametervalue }" onChange="{ handleChange }")

  script.
    import './parameter-form.tag';
    import './schema.tag';
    import script from './parameter';
    this.external(script);
