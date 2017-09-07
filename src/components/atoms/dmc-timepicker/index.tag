dmc-timepicker.Timepicker
  .Timepicker__label(if="{ !!opts.label }") { opts.label }
  input.Timepicker__input(onTap="handleInputTap" ref="touch" placeholder="{ opts.placeholder}" value="{ displayFormatDate }" readonly="readonly")
  .Timepicker__partialTime(if="{ opts.isshown }")
    .Timepicker__partialTimeBody
      .Timepicker__partialTimeList(ref="hourlist")
        dmc-timepicker-partial(each="{ generateTimes('hour') }" date="{ date }" time="{ displayNum }" isSelected="{ isSelected }" scroll="{ scroll }" onPat="{ parent.handleSelectItemTap }")
      .Timepicker__partialTimeList(ref="minutelist")
        dmc-timepicker-partial(each="{ generateTimes('minute') }" date="{ date }" time="{ displayNum }" isSelected="{ isSelected }" scroll="{ scroll }" onPat="{ parent.handleSelectItemTap }")
      .Timepicker__partialTimeList(ref="secondlist")
        dmc-timepicker-partial(each="{ generateTimes('second') }" date="{ date }" time="{ displayNum }" isSelected="{ isSelected }" scroll="{ scroll }" onPat="{ parent.handleSelectItemTap }")

  script.
    import './partial.tag';
    import script from './index';
    this.external(script);
