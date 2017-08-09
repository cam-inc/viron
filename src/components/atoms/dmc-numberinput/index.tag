dmc-numberinput.Numberinput
  .Numberinput__label(if="{ !!opts.label }") { opts.label }
  form.Numberinput__form(onSubmit="{ handleFormSubmit }")
  input.Numberinput__input(onTap="handleInputTap" ref="touch" value="{ opts.value }" placeholder="{ opts.placeholder || '' }")

  script.
    import script from './index';
    this.external(script);