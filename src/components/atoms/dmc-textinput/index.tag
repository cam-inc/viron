dmc-textinput.Textinput(class="{ 'Textinput--disabled' : opts.isdisabled }" ref="touch" onTap="handleTap")
  .Textinput__label(if="{ !!opts.label }") { opts.label }
  form(ref="form" onSubmit="{ handleFormSubmit }")
    input.Textinput__input(ref="input" type="{ opts.type || 'text' }" value="{ normalizeValue(opts.text) }" placeholder="{ opts.placeholder || '' }" pattern="{ opts.pattern }" disabled="{ !!opts.isdisabled }" onInput="{ handleInputInput }" onChange="{ handleInputChange }")

  script.
    import script from './index';
    this.external(script);
