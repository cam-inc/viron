dmc-textarea.Textarea(ref="touch" onTap="handleTap")
  .Textarea__label(if="{ !!opts.label }") { opts.label }
  form.Textarea__content(ref="form" onSubmit="{ handleFormSubmit }")
    textarea.Textarea__input(ref="textarea" value="{ normalizeValue(opts.text) }" maxlength="{ opts.maxlength }" placeholder="{ opts.placeholder || '' }" onInput="{ handleTextareaInput }" onChange="{ handleTextareaChange }")

  script.
    import script from './index';
    this.external(script);
