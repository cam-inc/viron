viron-component-search.ComponentSearch
  .ComponentSearch__body
    viron-parameters(parameterObjects="{ opts.parameterObjects }" parameters="{ currentParameters }" onChange="{ handleParametersChange }")
  .ComponentSearch__tail
    viron-button(label="検索する" onPat="{ handleSubmitButtonPat }")

  script.
    import '../../organisms/viron-parameters/index.tag';
    import '../../atoms/viron-button/index.tag';
    import script from './search';
    this.external(script);
