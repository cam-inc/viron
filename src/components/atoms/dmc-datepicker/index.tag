dmc-datepicker.Datepicker
  .Datepicker__label(if="{ !!opts.label }") { opts.label }
  .Datepicker__form
    input.Datepicker__input(onTap="handleInputTap" ref="touch" value="{ displayFormatDate }" placeholder="{ opts.placeholder || '' }" readonly="readonly")
    .Datepicker__calendar(if="{ opts.isshown }")
      .Datepicker__head
        .Datepicker__transition(onTap="handlePrevButtonPat" ref="touch") &lt;
        .Datepicker__month { displayDate.year() } 
          span { settingDateName.month[opts.language || 'ja'][displayDate.month()] }
        .Datepicker__transition(onTap="handleNextButtonPat" ref="touch") &gt;
      .Datepicker__days
        .Datepicker__day(each="{ day, index in settingDateName.days[opts.language || 'ja'] }" class="{ (index === 0) ? 'Datepicker__day--sunday' : '' } { (index === 6) ? 'Datepicker__day--saturday' : '' }") { day }
      .Datepicker__container
        virtual(each="{ cell in generateCalendar() }")
          dmc-datepicker-cell(date="{ cell.date }" isCurrentMonth="{ cell.isCurrentMonth }" isToday="{ cell.isToday }" isSelected="{ cell.isSelected }" onPat="{ handleCellPat }")
  script.
    import '../../atoms/dmc-datepicker/cell.tag';
    import script from './index';
    this.external(script);
