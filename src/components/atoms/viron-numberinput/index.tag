viron-numberinput.Numberinput(class="{ 'Numberinput--disabled' : opts.isdisabled }")
  .Numberinput__label(if="{ !!opts.label }") { opts.label }
  form.Numberinput__form(onSubmit="{ handleFormSubmit }" onKeyDown="{ handleFormKeyDown }")
    input.Numberinput__input(ref="input" value="{ normalizeValue(opts.number) }" placeholder="{ opts.placeholder || '' }" disabled="{ !!opts.isdisabled }" onInput="{ handleInputInput }" onChange="{ handleInputChange }")
    .Numberinput__handler
      .Numberinput__handlerButton(onClick="{ handleIncreaseButtonPpat }" class="{ 'Numberinput__handlerButton--disabled' : (opts.isdisabled || !isIncrementable()) }")
        viron-icon(type="caretUp")
      .Numberinput__handlerButton(onClick="{ handleDecreaseButtonPpat }" class="{ 'Numberinput__handlerButton--disabled' : (opts.isdisabled || !isDecrementable()) }")
        viron-icon(type="caretDown")

  script.
    import '../viron-icon/index.tag';
    import script from './index';
    this.external(script);
