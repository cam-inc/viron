dmc-textarea.Textarea(ref="touch" onTap="handleTap")
  .Textarea__label(if="{ !!opts.label }") { opts.label }
  form.Textarea__content(ref="form")
    textarea.Textarea__input(ref="textarea" value="{ opts.text }" maxlength="{ opts.maxlength }" placeholder="{ opts.placeholder || '' }" onInput="{ handleTextareaInput }" onChange="{ handleTextareaChange }")

  script.
    import script from './index';
    this.external(script);
