viron-parameters-parameter.Parameters_Parameter(class="{ 'Parameters_Parameter--wide' : (isPropertiesMode || isItemsMode ) }")
  virtual(if="{ isFormMode }")
    viron-parameters-form(formObject="{ formObject }" identifier="{ parameterObject.name }" val="{ opts.val }" onChange="{ parent.handleValChange }")
  virtual(if="{ isPropertiesMode }")
    viron-parameters-properties(label="{ propertiesLabel }" identifier="{ parameterObject.name }" val="{ opts.val }" required="{ parameterObject.required }" propertiesObject="{ propertiesObject }" onChange="{ parent.handleValChange }")
  virtual(if="{ isItemsMode }")
    viron-parameters-items(label="{ itemsLabel }" identifier="{ parameterObject.name }" val="{ opts.val }" required="{ parameterObject.required }" itemsObject="{ itemsObject }" onChange="{ handleValChange }")

  script.
    import '../form/index.tag';
    import '../items/index.tag';
    import '../properties/index.tag';
    import script from './index';
    this.external(script);
