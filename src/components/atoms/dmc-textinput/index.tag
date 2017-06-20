dmc-textinput(class="Input { opts.isfocused ? 'Input--focused' : '' } { opts.isdisabled ? 'Input--disabled' : '' }" ref="touch" onTap="handleTap")
  form.Input__content(ref="form" onSubmit="{ handleFormSubmit }")
    .Input__icon(if="{ !!opts.icon }")
      dmc-icon(type="{ opts.icon }")
    input.Input__input(type="{ opts.type || 'text' }" value="{ opts.text }" placeholder="{ opts.placeholder || '' }" disabled="{ opts.isdisabled }" pattern="{ opts.pattern }" onInput="{ handleInputInput }" onChange="{ handleInputChange }" onFocus="{ handleInputFocus }" onBlur="{ handleInputBlur }")
    .Input__resetButton(if="{ opts.isresetable }" ref="touch" onTap="handleResetButtonTap")
      dmc-icon(type="close")

  script.
    import '../../atoms/dmc-icon/index.tag';
    import script from './index';
    this.external(script);
