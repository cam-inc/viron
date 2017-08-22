dmc-timepicker.Timepicker
  .Timepicker__label(if="{ !!opts.label }") { opts.label }
  input.Timepicker__input(onClick="{ handleInputTime }")
  .Timepicker__body(if="{ this.isShowTimepicker }")
    input.Timepicker__input.Timepicker__input--modifier(onClick="{ handleInputTime }")
    ul.Timepicker__list.Timepicker__list--left
      li 00
      li 01
      li 02
      li 03
      li 04
      li 05
    ul.Timepicker__list.timepicker__list--center
      li 00
      li 01
      li 02
      li 03
      li 04
      li 05
    ul.Timepicker__list.timepicker__list--right
      li 00
      li 01
      li 02
      li 03
      li 04
      li 05

    script.
      import script from './index';
      this.external(script);
