dmc-component-search.ComponentSearch
  .ComponentSearch__body
    dmc-parameters(parameterObjects="{ opts.parameterObjects }" parameters="{ currentParameters }" onChange="{ handleParametersChange }")
  .ComponentSearch__tail
    dmc-button(label="検索する" onPat="{ handleSubmitButtonPat }")

  script.
    import '../../organisms/dmc-parameters/index.tag';
    import script from './search';
    this.external(script);
