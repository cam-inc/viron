dmc-timepicker.Timepicker
    .Timepicker__label(if="{ !!opts.label }") { opts.label }
    .Timepicker__input(onClick="{ handleInputTime }") { displayFormatDate }
    .Partialtime(if="{ isShowTimepicker }")
      .Partialtime__body
        .Partialtime__list.Partialtime__list--left
          dmc-timepicker-partial(each="{ hour in generateHours() }" date="{ hour.date }" time="{ hour.displayTime }" onPat="{ parent.handleSelectItem }")
        .Partialtime__list.Partialtime__list--center
          dmc-timepicker-partial(each="{ minute in generateMinutes() }" date="{ minute.date }" time="{ minute.displayTime }" onPat="{ parent.handleSelectItem }")
        .Partialtime__list.Partialtime__list--right
          dmc-timepicker-partial(each="{ second in generateSeconds() }" date="{ second.date }" time="{ second.displayTime }" onPat="{ parent.handleSelectItem }")

    script.
      import '../../atoms/dmc-timepicker/partial.tag';
      import script from './index';
      this.external(script);
