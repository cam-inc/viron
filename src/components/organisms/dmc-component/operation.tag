dmc-component-operation.ComponentOperation
  .ComponentOperation__head
    .ComponentOperation__title { opts.title }
    .ComponentOperation__description(if="{ !!opts.description }") { opts.description }
  .ComponentOperation__body
    dmc-parameters(parameterObjects="{ opts.parameterObjects }" parameters="{ currentParameters }" additionalInfo="{ additionalInfo }" onChange="{ handleParametersChange }")
  .ComponentOperation__tail
    dmc-button(label="{ submitButtonLabel }" type="{ submitButtonType }" onPat="{ handleSubmitButtonPat }")
    dmc-button(label="閉じる" type="secondary" onPat="{ handleCancelButtonPat }")

  script.
    import script from './operation';
    this.external(script);
