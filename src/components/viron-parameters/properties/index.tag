viron-parameters-properties.Parameters_Properties
  .Parameters_Properties__head
    .Parameters_Properties__label { opts.label }{ opts.required ? ' *' : '' }
  .Parameters_Properties__body
    .Parameters_Properties__item(each="{ property, key in propertiesObject.properties }" class="{ 'Parameters_Properties__item--wide': parent.isWide(key, property) }")
      virtual(if="{ isFormMode(property) }")
        viron-parameters-form(no-reorder identifier="{ key }" val="{ parent.getVal(key) }" formObject="{ parent.getFormObject(key, property) }" onChange="{ parent.handlePropertyChange }")
      virtual(if="{ isPropertiesMode(property) }")
        viron-parameters-properties(no-reorder label="{ key }" identifier="{ key }" val="{ parent.getVal(key) }" required="{ parent.getRequired(key) }" propertiesObject="{ parent.getPropertiesObject(key, property) }" onChange="{ parent.handlePropertyChange }")
      virtual(if="{ isItemsMode(property) }")
        viron-parameters-items(no-reorder label="{ key }" identifier="{ key }" val="{ parent.getVal(key) }" required="{ parent.getRequired(key) }" itemsObject="{ parent.getItemsObject(key, property) }" onChange="{ parent.handlePropertyChange }")


  script.
    import '../form/index.tag';
    import '../items/index.tag';
    import script from './index';
    this.external(script);
