dmc-parameter.Parameter
  .Parameter__head
    .Parameter__name name: { name }
    .Parameter__in in: { _in }
    .Parameter__description description: { description }
    .Parameter__required required: { required ? '必須' : 'not必須' }
  virtual(if="{ !isSchemaMode }")
    dmc-parameter-form(if="{ isSingleForm }" val="{ opts.val }" parameterObject="{ parameterObject }" onChange="{ handleChange }")

  script.
    import './form.tag';
    import script from './parameter';
    this.external(script);
