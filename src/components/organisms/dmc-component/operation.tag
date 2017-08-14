dmc-component-operation.ComponentOperation
  .ComponentOperation__head
    .ComponentOperation__name { opts.name }
    .ComponentOperation__description { opts.description }
  .ComponentOperation__body
    dmc-parameters(parameterObjects="{ opts.parameterObjects }" parameters="{ currentParameters }" onChange="{ handleParametersChange }")
  .ComponentOperation__tail
    dmc-button(label="submit" onPat="{ handleSubmitButtonPat }")
    dmc-button(label="cancel" onPat="{ handleCancelButtonPat }")

  script.
    import script from './operation';
    this.external(script);
