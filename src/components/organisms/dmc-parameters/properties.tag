dmc-parameter-properties.ParameterProperties(class="{ isInfoOpened ? 'ParameterProperties--infoOpened' : '' } { isBodyOpened ? 'ParameterProperties--bodyOpened' : '' }")
  .ParameterProperties__head
    .ParameterProperties__caption
      .ParameterProperties__title todo
      .ParameterProperties__infoOpenShutButton(ref="touch" onTap="handleInfoOpenShutButtonTap")
        dmc-icon(type="infoCirlceO")
      .ParameterProperties__bodyOpenShutButton(ref="touch" onTap="handleBodyOpenShutButtonTap")
        dmc-icon(type="up")
    .ParameterProperties__info
      .ParameterProperties__required todo
  .ParameterProperties__body
    dmc-parameter-property(each="{ property, key in properties }" key="{ key }" property="{ property }" val="{ parent.getPropertyValue(property, key) }" onChange="{ parent.handlePropertyChange }")

  script.
    import './property.tag';
    import script from './properties';
    this.external(script);
