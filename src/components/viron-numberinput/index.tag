viron-numberinput.Numberinput(class="{ 'Numberinput--disabled': opts.isdisabled, 'Numberinput--preview': opts.ispreview, 'Numberinput--error': opts.iserror } Numberinput--{ opts.theme }" onTap="{ handleTap }")
  .Numberinput__label(if="{ !!opts.label }") { opts.label }
  form.Numberinput__form(ref="form" onSubmit="{ handleFormSubmit }")
    input.Numberinput__input(ref="input" type="text" value="{ normalizeValue(opts.val) }" placeholder="{ opts.placeholder }" disabled="{ !!opts.isdisabled }" onInput="{ handleInputInput }" onChange="{ handleInputChange }" onFocus="{ handleInputFocus }" onBlur="{ handleInputBlur }")
  .Numberinput__blocker(if="{ opts.ispreview }" onTap="{ handleBlockerTap }")

  script.
    import script from './index';
    this.external(script);
