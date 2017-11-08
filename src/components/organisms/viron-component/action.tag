viron-component-action.Component__action
  viron-button(label="{ label }" icon="{ icon }" onPpat="{ handleButtonPpat }")

  script.
    import '../../atoms/viron-button/index.tag';
    import script from './action';
    this.external(script);
