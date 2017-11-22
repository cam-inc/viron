viron-parameters.Parameters
  .Parameters__parameter(each="{ parameterObject in opts.parameterobjects }")
    .Parameters__parameterBody
      virtual(if="{ isFormMode(parameterObject) }")
        viron-parameters-form(formData="{ parameterObject }" identifier="{ parameterObject.name }" val="{ opts.val[parameterObject.name] }" onChange="{ parent.handleValChange }")
      virtual(if="{ isSchemaMode(parameterObject) }")
        viron-parameters-schema(name="{ parameterObject.name }" identifier="{ parameterObject.name }" val="{ opts.val[parameterObject.name] }" required="{ parameterObject.required }" schemaObject="{ parameterObject.schema }" onChange="{ parent.handleValChange }")

  script.
    import './form/index.tag';
    import './schema/index.tag';
    import script from './index';
    this.external(script);
