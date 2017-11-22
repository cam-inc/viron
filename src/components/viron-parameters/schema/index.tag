viron-parameters-schema.Parameters_Schema(class="{ 'Parameters_Schema--multi': isMulti }")
  virtual(if="{ isFormMode }")
    viron-parameters-form(formData="{ getFormData() }" identifier="{ getFormData().name }" val="{ opts.val }" onChange="{ handleFormChange }")
  virtual(if="{ isSchemaMode }")
    .Parameters_Schema__head
      .Parameters_Schema__title { title }
    .Parameters_Schema__body
      virtual(each="{ property, key in schemaObject.properties }")
        viron-parameters-schema(name="{ key }" identifier="{ key }" val="{ parent.getPropertyValue(key) }" required="{ parent.isPropertyRequired(key) }" schemaObject="{ property }" onChange="{ parent.handlePropertyChange }")

  script.
    import '../form/index.tag';
    import script from './index';
    this.external(script);
