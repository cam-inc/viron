dmc-textinput.Textinput(ref="touch" onTap="handleTap")
  .Textinput__label(if="{ !!opts.label }") { opts.label }
  form(ref="form" onSubmit="{ handleFormSubmit }")
    input.Textinput__input(type="{ opts.type || 'text' }" value="{ opts.text }" placeholder="{ opts.placeholder || '' }" pattern="{ opts.pattern }" onInput="{ handleInputInput }" onChange="{ handleInputChange }")

  script.
    import script from './index';
    this.external(script);
