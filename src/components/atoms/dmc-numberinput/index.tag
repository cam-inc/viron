dmc-numberinput.Numberinput
  .Numberinput__label(if="{ !!opts.label }") { opts.label }
  form.Numberinput__form(onSubmit="{ handleFormSubmit }" onKeyDown="{ handleFormKeyDown }")
    input.Numberinput__input(ref="input" value="{ (opts.number === 0 || opts.number) ? opts.number : '' }" placeholder="{ opts.placeholder || '' }" onInput="{ handleInputInput }" onChange="{ handleInputChange }")
    .Numberinput__handler
      .Numberinput__handlerButton(onTap="handleIncreaseButtonPat" ref="touch" disabled="{opts.number >= opts.max}")
        dmc-icon(type="caretUp" class="caretUp")
      .Numberinput__handlerButton(onTap="handleDecreaseButtonPat" ref="touch" disabled="{opts.number <= opts.min}")
        dmc-icon(type="caretDown" class="caretDown")

  script.
    import '../dmc-icon/index.tag';
    import script from './index';
    this.external(script);