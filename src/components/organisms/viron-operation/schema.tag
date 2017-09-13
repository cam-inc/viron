viron-operation-schema.Operation__schema
  viron-operation-schema-form(each="{ propertyKey in propertyKeys }" parameterObject="{ parent.getParameterObject(propertyKey) }" parameterValue="{ parent.getValue(propertyKey) }" onChange="{ parent.handleChange }")

  script.
    import './schema-form.tag';
    import script from './schema';
    this.external(script);
