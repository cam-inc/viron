dmc-numberinput.Numberinput(class="{ 'Numberinput--disabled' : opts.isdisabled }")
  .Numberinput__label(if="{ !!opts.label }") { opts.label }
  form.Numberinput__form(onSubmit="{ handleFormSubmit }" onKeyDown="{ handleFormKeyDown }")
    input.Numberinput__input(ref="input" value="{ normalizeValue(opts.number) }" placeholder="{ opts.placeholder || '' }" disabled="{ !!opts.isdisabled }" onInput="{ handleInputInput }" onChange="{ handleInputChange }")
    .Numberinput__handler
      .Numberinput__handlerButton(onTap="handleIncreaseButtonPat" ref="touch" class="{ 'Numberinput__handlerButton--disabled' : (opts.isdisabled || !isIncrementable()) }")
        dmc-icon(type="caretUp")
      .Numberinput__handlerButton(onTap="handleDecreaseButtonPat" ref="touch" class="{ 'Numberinput__handlerButton--disabled' : (opts.isdisabled || !isDecrementable()) }")
        dmc-icon(type="caretDown")

  script.
    import '../dmc-icon/index.tag';
    import script from './index';
    this.external(script);
