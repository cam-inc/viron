dmc-timepicker.Timepicker
    .Timepicker__label(if="{ !!opts.label }") { opts.label }
    input.Timepicker__input(onTap="handleInputTap" ref="touch" placeholder="{ opts.placeholder}" value="{ displayFormatDate }" readonly="readonly")
    .Timepicker__partialTime(if="{ opts.isshown }")
      .Partialtime__body
        .Partialtime__list.Partialtime__list--left(ref="hourlist")
          dmc-timepicker-partial(datetype="hour" each="{ generateTimes('hour') }" date="{ date }" time="{ displayTime }" isSelected="{ isSelected }" scroll="{ scroll }" onPat="{ parent.handleSelectItemTap }")
        .Partialtime__list.Partialtime__list--center(ref="minutelist")
          dmc-timepicker-partial(datetype="minute" each="{ generateTimes('minute') }" date="{ date }" time="{ displayTime }" isSelected="{ isSelected }" scroll="{ scroll }" onPat="{ parent.handleSelectItemTap }")
        .Partialtime__list.Partialtime__list--right(ref="secondlist")
          dmc-timepicker-partial(datetype="second" each="{ generateTimes('second') }" date="{ date }" time="{ displayTime }" isSelected="{ isSelected }" scroll="{ scroll }" onPat="{ parent.handleSelectItemTap }")

    script.
      import '../../atoms/dmc-timepicker/partial.tag';
      import script from './index';
      this.external(script);
