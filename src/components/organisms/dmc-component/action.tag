dmc-component-action.Component__action
  dmc-button(label="{ label }" onPat="{ handleButtonPat }")

  script.
    import '../../atoms/dmc-button/index.tag';
    import script from './action';
    this.external(script);
