dmc-parameter-schema.ParameterSchema
  .ParameterSchema__head
    .ParameterSchema__title title: { title }
    .ParameterSchema__description description: { description }
    .ParameterSchema__required required: { required ? '必須' : 'not必須' }
    .ParameterSchema__type type: { type }
  div ddd

  script.
    import script from './schema';
    this.external(script);
