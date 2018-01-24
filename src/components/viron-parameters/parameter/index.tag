viron-parameters-parameter.Parameters_Parameter(class="{ 'Parameters_Parameter--' + spreadStyle  }")
  virtual(if="{ isFormMode }")
    viron-parameters-form(formObject="{ formObject }" identifier="{ parameterObject.name }" val="{ opts.val }" theme="{ opts.theme }" isPreview="{ opts.ispreview }" isDisabled="{ isFormDisabled }" onChange="{ handleValChange }" onValidate="{ handleValValidate }")
  virtual(if="{ isPropertiesMode }")
    viron-parameters-properties(label="{ propertiesLabel }" identifier="{ parameterObject.name }" val="{ opts.val }" theme="{ opts.theme }" isPreview="{ opts.ispreview }" required="{ parameterObject.required }" propertiesObject="{ propertiesObject }" onChange="{ handleValChange }" onValidate="{ handleValValidate }")
  virtual(if="{ isItemsMode }")
    viron-parameters-items(label="{ itemsLabel }" identifier="{ parameterObject.name }" val="{ opts.val }" theme="{ opts.theme }" isPreview="{ opts.ispreview }" required="{ parameterObject.required }" schemaObject="{ schemaObject }" onChange="{ handleValChange }" onValidate="{ handleValValidate }")

  script.
    import '../form/index.tag';
    import '../items/index.tag';
    import '../properties/index.tag';
    import script from './index';
    this.external(script);
