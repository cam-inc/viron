viron-parameters-properties.Parameters_Properties
  .Parameters_Properties__head
    .Parameters_Properties__label { opts.label }{ opts.required ? ' *' : '' }
  .Parameters_Properties__error(if="{ hasError }") { errors[0] }
  .Parameters_Properties__body
    .Parameters_Properties__item(each="{ property, key in propertiesObject.properties }" class="{ 'Parameters_Properties__item--' + parent.getSpreadStyle(key, property) }")
      virtual(if="{ isFormMode(property) }")
        viron-parameters-form(no-reorder identifier="{ key }" val="{ parent.getVal(key) }" theme="{ parent.opts.theme }" isPreview="{ parent.opts.ispreview }" formObject="{ parent.getFormObject(key, property) }" onChange="{ parent.handlePropertyChange }" onValidate="{ parent.handlePropertyValidate }")
      virtual(if="{ isPropertiesMode(property) }")
        viron-parameters-properties(no-reorder label="{ key }" identifier="{ key }" val="{ parent.getVal(key) }" theme="{ parent.opts.theme }" isPreview="{ parent.opts.ispreview }" required="{ parent.getRequired(key) }" propertiesObject="{ parent.getPropertiesObject(key, property) }" onChange="{ parent.handlePropertyChange }" onValidate="{ parent.handlePropertyValidate }")
      virtual(if="{ isItemsMode(property) }")
        viron-parameters-items(no-reorder label="{ key }" identifier="{ key }" val="{ parent.getVal(key) }" theme="{ parent.opts.theme }" isPreview="{ parent.opts.ispreview }" required="{ parent.getRequired(key) }" schemaObject="{ parent.getSchemaObject(key, property) }" onChange="{ parent.handlePropertyChange }" onValidate="{ parent.handlePropertyValidate }")


  script.
    import '../form/index.tag';
    import '../items/index.tag';
    import script from './index';
    this.external(script);
