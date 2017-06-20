dmc-textarea(class="Textarea { opts.isfocused ? 'Textarea--focused' : '' } { opts.isdisabled ? 'Textarea--disabled' : '' }" ref="touch" onTap="handleTap")
  form.Textarea__content(ref="form")
    textarea.Textarea__input(value="{ opts.text }" maxlength="{ opts.maxlength }" placeholder="{ opts.placeholder || '' }" disabled="{ opts.isdisabled }" onInput="{ handleTextareaInput }" onChange="{ handleTextareaChange }" onFocus="{ handleTextareaFocus }" onBlur="{ handleTextareaBlur }")

  script.
    import script from './index';
    this.external(script);
