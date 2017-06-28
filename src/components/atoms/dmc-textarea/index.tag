dmc-textarea.Textarea(ref="touch" onTap="handleTap")
  form.Textarea__content(ref="form")
    textarea.Textarea__input(value="{ opts.text }" maxlength="{ opts.maxlength }" placeholder="{ opts.placeholder || '' }" onInput="{ handleTextareaInput }" onChange="{ handleTextareaChange }")

  script.
    import script from './index';
    this.external(script);
