viron-textarea.Textarea(class="{ 'Textarea--disabled': opts.isdisabled, 'Textarea--error': opts.iserror }" onTap="{ handleTap }")
  .Textarea__label(if="{ !!opts.label }") { opts.label }
  form.Textarea__form(ref="form" onSubmit="{ handleFormSubmit }")
    textarea.Textarea__input(ref="input" value="{ normalizeValue(opts.val) }" placeholder="{ opts.placeholder }" disabled="{ !!opts.isdisabled }" onInput="{ handleTextareaInput }" onChange="{ handleTextareaChange }" onFocus="{ handleTextareaFocus }" onBlur="{ handleTextareaBlur }")
  .Textarea__blocker(if="{ opts.ispreview }" onTap="{ handleBlockerTap }")

  script.
    import script from './index';
    this.external(script);
