dmc-timepicker.Timepicker
    .Timepicker__label(if="{ !!opts.label }") { opts.label }
    .Timepicker__input(onClick="{ handleInputTime }") { displayTime }
    .Partialtime(if="{ isShowTimepicker }")
      .Partialtime__body
        .Partialtime__list.Partialtime__list--left
          dmc-timepicker-partial(each="{ generateHours() }" date="{ formatDate }" time="{ displayTime }" onPat="{ parent.handleSelectHour }")
        .Partialtime__list.Partialtime__list--center
          dmc-timepicker-partial(each="{ generateMinutes() }" date="{ formatDate }" time="{ displayTime }" onPat="{ parent.handleSelectMinute }")
        .Partialtime__list.Partialtime__list--right
          dmc-timepicker-partial(each="{ generateSeconds() }" date="{ formatDate }" time="{ displayTime }" onPat="{ parent.handleSelectSecond }")

    script.
      import '../../atoms/dmc-timepicker/partial.tag';
      import script from './index';
      this.external(script);
