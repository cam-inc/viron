dmc-component-operation.ComponentOperation
  .ComponentOperation__head
    .ComponentOperation__title { opts.title }
    .ComponentOperation__description(if="{ !!opts.description }") { opts.description }
  .ComponentOperation__body
    dmc-parameters(parameterObjects="{ opts.parameterObjects }" parameters="{ currentParameters }" onChange="{ handleParametersChange }")
  .ComponentOperation__tail
    dmc-button(label="送信" onPat="{ handleSubmitButtonPat }")
    dmc-button(label="閉じる" onPat="{ handleCancelButtonPat }")

  script.
    import script from './operation';
    this.external(script);
