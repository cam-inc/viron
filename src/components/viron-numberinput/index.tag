viron-numberinput.Numberinput(class="{ 'Numberinput--disabled': opts.isdisabled, 'Numberinput--error': opts.iserror }" onTap="{ handleTap }")
  .Numberinput__label(if="{ !!opts.label }") { opts.label }
  form.Numberinput__form(ref="form" onSubmit="{ handleFormSubmit }")
    input.Numberinput__input(ref="input" type="text" value="{ normalizeValue(opts.val) }" placeholder="{ opts.placeholder }" disabled="{ !!opts.isdisabled }" onInput="{ handleInputInput }" onChange="{ handleInputChange }")
  .Numberinput__blocker(if="{ opts.ispreview }" onTap="{ handleBlockerTap }")

  script.
    import script from './index';
    this.external(script);
