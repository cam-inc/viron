dmc-timepicker-partial.Partialtime
  .Partialtime__body
    input.Partialtime__input.Partialtime__input--modifier(value="{ displayPartialTime }")
    .Partialtime__list.Partialtime__list--left
      dmc-timepicker-partialitem(each="{ generateHours() }" date="{ date }" time="{ displayTime }" onPat="{ parent.handleSelectHour }")
    .Partialtime__list.Partialtime__list--center
      dmc-timepicker-partialitem(each="{ generateMinutes() }" date="{ date }" time="{ displayTime }" onPat="{ parent.handleSelectMinute }")
    .Partialtime__list.Partialtime__list--right
      dmc-timepicker-partialitem(each="{ generateSeconds() }" date="{ date }" time="{ displayTime }" onPat="{ parent.handleSelectSecond }")

    script.
      import '../../atoms/dmc-timepicker/partialitem.tag';
      import script from './partial';
      this.external(script);
