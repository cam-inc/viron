viron-numberinput.Numberinput(class="{ 'Numberinput--disabled': opts.isdisabled }" onTap="{ handleTap }")
  .Numberinput__label(if="{ !!opts.label }") { opts.label }
  form.Numberinput__form(ref="form" onSubmit="{ handleFormSubmit }")
    input.Numberinput__input(ref="input" type="text" value="{ normalizeValue(opts.val) }" placeholder="{ opts.placeholder }" disabled="{ !!opts.isdisabled }" onInput="{ handleInputInput }" onChange="{ handleInputChange }")

  script.
    import script from './index';
    this.external(script);
