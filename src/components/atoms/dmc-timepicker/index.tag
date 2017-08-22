dmc-timepicker.Timepicker
  .Timepicker__label(if="{ !!opts.label }") { opts.label }
  input.Timepicker__input(onClick="{ handleInputTime }" value="")
  .Timepicker__body(if="{ this.isShowTimepicker }")
    input.Timepicker__input.Timepicker__input--modifier(value="")
    ul.Timepicker__list.Timepicker__list--left
      li.Timepicker__listItem(each="{ generateHours() }" value="{ hour }") { hour }
    ul.Timepicker__list.timepicker__list--center
      li.Timepicker__listItem(each="{ generateMinutes() }" value="{ minute }") { minute }
    ul.Timepicker__list.timepicker__list--right
      li.Timepicker__listItem(each="{ generateSeconds() }" value="{ second }") { second }

    script.
      import script from './index';
      this.external(script);
