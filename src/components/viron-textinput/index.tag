viron-textinput.Textinput(class="{ 'Textinput--disabled': opts.isdisabled, 'Textinput--preview': opts.ispreview, 'Textinput--error': opts.iserror } Textinput--{ opts.theme }" onTap="{ handleTap }")
  .Textinput__label(if="{ !!opts.label }") { opts.label }
  form.Textinput__form(ref="form" onSubmit="{ handleFormSubmit }")
    input.Textinput__input(ref="input" type="{ opts.type || 'text' }" value="{ normalizeValue(opts.val) }" placeholder="{ opts.placeholder }" disabled="{ !!opts.isdisabled }" onInput="{ handleInputInput }" onChange="{ handleInputChange }" onFocus="{ handleInputFocus }" onBlur="{ handleInputBlur }")
  .Textinput__blocker(if="{ opts.ispreview }" onTap="{ handleBlockerTap }")

  script.
    import script from './index';
    this.external(script);
