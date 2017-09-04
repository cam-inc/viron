dmc-timepicker.Timepicker
    .Timepicker__label(if="{ !!opts.label }") { opts.label }
    .Timepicker__input(onTap="handleInputTap" ref="touch" date="{ datatime }") { displayFormatDate }
    .Timepicker__partialTime(if="{ opts.isshown }")
      .Partialtime__body
        .Partialtime__list.Partialtime__list--left(ref="hourscroll")
          dmc-timepicker-partial(datetype="hour" each="{ hour in generateHours() }" date="{ hour.date }" time="{ hour.displayTime }" isSelected="{ hour.isSelected }" scroll="{ hour.scroll }" onPat="{ parent.handleSelectItem }")
        .Partialtime__list.Partialtime__list--center(ref="minutescroll")
          dmc-timepicker-partial(datetype="minute" each="{ minute in generateMinutes() }" date="{ minute.date }" time="{ minute.displayTime }" isSelected="{ minute.isSelected }" scroll="{ minute.scroll }" onPat="{ parent.handleSelectItem }")
        .Partialtime__list.Partialtime__list--right(ref="secondscroll")
          dmc-timepicker-partial(datetype="second" each="{ second in generateSeconds() }" date="{ second.date }" time="{ second.displayTime }" isSelected="{ second.isSelected }" scroll="{ second.scroll }" onPat="{ parent.handleSelectItem }")

    script.
      import '../../atoms/dmc-timepicker/partial.tag';
      import script from './index';
      this.external(script);
