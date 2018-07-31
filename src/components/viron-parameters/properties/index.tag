viron-parameters-properties.Parameters_Properties
  .Parameters_Properties__head
    .Parameters_Properties__label { opts.label }{ opts.required ? ' *' : '' }
    .Parameters_Properties__select(if="{ isPropertiesSwitchable }")
      .Parameters_Properties__selectLabel 形式:
      viron-select(isSmall="{ true }" options="{ getPropertiesOptions() }" onChange="{ handleSelectChange }" isPreview="{ opts.ispreview || !opts.isswitchable }")
  .Parameters_Properties__error(if="{ hasError }") { errors[0] }
  .Parameters_Properties__body(if="{ isReady }")
    .Parameters_Properties__item(each="{ property, key in getProperties() }" class="{ 'Parameters_Properties__item--' + parent.getSpreadStyle(key, property) }")
      virtual(if="{ isFormMode(property) }")
        viron-parameters-form(no-reorder identifier="{ key }" val="{ parent.getVal(key) }" theme="{ parent.opts.theme }" isPreview="{ parent.opts.ispreview }" formObject="{ parent.getFormObject(key, property) }" onSubmit="{ parent.handlePropertySubmit }" onChange="{ parent.handlePropertyChange }" onValidate="{ parent.handlePropertyValidate }")
      virtual(if="{ isPropertiesMode(property) }")
        viron-parameters-properties(no-reorder label="{ key }" identifier="{ key }" val="{ parent.getVal(key) }" theme="{ parent.opts.theme }" isPreview="{ parent.opts.ispreview }" isSwitchable="{ parent.opts.isswitchable }" required="{ parent.getRequired(key) }" propertiesObject="{ parent.getPropertiesObject(key, property) }" onSubmit="{ parent.handlePropertySubmit }" onChange="{ parent.handlePropertyChange }" onValidate="{ parent.handlePropertyValidate }")
      virtual(if="{ isItemsMode(property) }")
        viron-parameters-items(no-reorder label="{ key }" identifier="{ key }" val="{ parent.getVal(key) }" theme="{ parent.opts.theme }" isPreview="{ parent.opts.ispreview }" isSwitchable="{ parent.opts.isswitchable }" required="{ parent.getRequired(key) }" schemaObject="{ parent.getSchemaObject(key, property) }" onSubmit="{ parent.handlePropertySubmit }" onChange="{ parent.handlePropertyChange }" onValidate="{ parent.handlePropertyValidate }")


  script.
    import '../../../components/viron-select/index.tag';
    import '../form/index.tag';
    import '../items/index.tag';
    import script from './index';
    this.external(script);
