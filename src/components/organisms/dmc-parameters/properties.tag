dmc-parameter-properties.ParameterProperties
  .ParameterProperties__body
    dmc-parameter-property(each="{ property, key in properties }" key="{ key }" property="{ property }" val="{ parent.getPropertyValue(property, key) }" _required="{ parent.required }" onChange="{ parent.handlePropertyChange }")

  script.
    import './property.tag';
    import script from './properties';
    this.external(script);
