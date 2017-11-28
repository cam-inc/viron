viron-textinput.Textinput(class="{ 'Textinput--disabled': opts.isdisabled, 'Textinput--error': opts.haserror }" onTap="{ handleTap }")
  .Textinput__label(if="{ !!opts.label }") { opts.label }
  form.Textinput__form(ref="form" onSubmit="{ handleFormSubmit }")
    input.Textinput__input(ref="input" type="{ opts.type || 'text' }" value="{ normalizeValue(opts.val) }" placeholder="{ opts.placeholder }" disabled="{ !!opts.isdisabled }" onInput="{ handleInputInput }" onChange="{ handleInputChange }")

  script.
    import script from './index';
    this.external(script);
