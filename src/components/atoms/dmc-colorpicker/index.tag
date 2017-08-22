dmc-colorpicker.Colorpicker
  .Colorpicker__label(if="{ !!opts.label }") { opts.label }
  input.Colorpicker__input(onTap="handleInputTap" ref="touch")
  script.
    import script from './index';
    this.external(script);