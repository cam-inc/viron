dmc-numberinput.Numberinput
  .Numberinput__label(if="{ !!opts.label }") { opts.label }
  form.Numberinput__form(onSubmit="{ handleFormSubmit }" onKeyDown="{ handleFormKeyDown }")
    input.Numberinput__input(ref="input" value="{ normalizeValue(opts.number) }" placeholder="{ opts.placeholder || '' }" onInput="{ handleInputInput }" onChange="{ handleInputChange }")
    .Numberinput__handler
      .Numberinput__handlerButton(onTap="handleIncreaseButtonPat" ref="touch" class="{ 'Numberinput__handlerButton--disabled' : !isIncrementable() }")
        dmc-icon(type="caretUp")
      .Numberinput__handlerButton(onTap="handleDecreaseButtonPat" ref="touch" class="{ 'Numberinput__handlerButton--disabled' : !isDecrementable() }")
        dmc-icon(type="caretDown")

  script.
    import '../dmc-icon/index.tag';
    import script from './index';
    this.external(script);
