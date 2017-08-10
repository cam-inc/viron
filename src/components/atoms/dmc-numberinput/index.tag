dmc-numberinput.Numberinput
  .Numberinput__label(if="{ !!opts.label }") { opts.label }
  form.Numberinput__form(onSubmit="{ handleFormSubmit }" onKeyDown="{ handleFormKeyDown }")
    input.Numberinput__input(ref="input" value="{ (opts.number === 0 || opts.number) ? opts.number : '' }" placeholder="{ opts.placeholder || '' }" onInput="{ handleInputInput }" onChange="{ handleInputChange }")
    .Numberinput__handler
      .Numberinput__handlerButton(onTap="handleIncreaseButtonPat" ref="touch" class="{(opts.number >= opts.max) ? 'Numberinput__handlerButton--disabled' : ''}")
        dmc-icon(type="caretUp")
      .Numberinput__handlerButton(onTap="handleDecreaseButtonPat" ref="touch" class="{(opts.number <= opts.min) ? 'Numberinput__handlerButton--disabled' : ''}")
        dmc-icon(type="caretDown")

  script.
    import '../dmc-icon/index.tag';
    import script from './index';
    this.external(script);