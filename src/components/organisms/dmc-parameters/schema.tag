dmc-parameter-schema.ParameterSchema
  virtual(if="{ isSingleFrom }")
    dmc-parameter-form(val="{ opts.val }" parameterObject="{ parameterObjectLike }" onChange="{ handleParameterChange }")
  virtual(if="{ !isSingleFrom }")
    div TODO

  script.
    import './form.tag';
    import script from './schema';
    this.external(script);
