dmc-timepicker.Timepicker
    .Timepicker__label(if="{ !!opts.label }") { opts.label }
    .Timepicker__input(onTap="handleInputTap" ref="touch") { displayFormatDate }
    .Timepicker__partialTime(if="{ opts.isshown }")
      .Partialtime__body
        .Partialtime__list.Partialtime__list--left
          dmc-timepicker-partial(each="{ hour in generateHours() }" date="{ hour.date }" time="{ hour.displayTime }" isSelected="{ hour.isSelected }" onPat="{ parent.handleSelectItem }")
        .Partialtime__list.Partialtime__list--center
          dmc-timepicker-partial(each="{ minute in generateMinutes() }" date="{ minute.date }" time="{ minute.displayTime }" isSelected="{ minute.isSelected }" onPat="{ parent.handleSelectItem }")
        .Partialtime__list.Partialtime__list--right
          dmc-timepicker-partial(each="{ second in generateSeconds() }" date="{ second.date }" time="{ second.displayTime }" isSelected="{ second.isSelected }" onPat="{ parent.handleSelectItem }")

    script.
      import '../../atoms/dmc-timepicker/partial.tag';
      import script from './index';
      this.external(script);
