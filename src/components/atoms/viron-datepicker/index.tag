viron-datepicker.Datepicker
  .Datepicker__label(if="{ !!opts.label }") { opts.label }
  form.Datepicker__form(onSubmit="{ handleFormSubmit }")
    input.Datepicker__input(onClick="{ handleInputClick }" value="{ opts.date }" placeholder="{ opts.placeholder || '' }" readonly="readonly" onInput="{ handleInputInput }" onChange="{ handleInputChange }")
    .Datepicker__calendar(if="{ opts.isshown }")
      .Datepicker__head
        .Datepicker__transition(onClick="{ handlePrevButtonPpat }") &lt;
        .Datepicker__month { displayDate.year() }
          span { settingDateName.month[opts.language || 'ja'][displayDate.month()] }
        .Datepicker__transition(onClick="{ handleNextButtonPpat }") &gt;
      .Datepicker__days
        .Datepicker__day(each="{ day, index in settingDateName.days[opts.language || 'ja'] }" class="{ (index === 0) ? 'Datepicker__day--sunday' : '' } { (index === 6) ? 'Datepicker__day--saturday' : '' }") { day }
      .Datepicker__container
        virtual(each="{ cell in generateCalendar() }")
          viron-datepicker-cell(date="{ cell.date }" isCurrentMonth="{ cell.isCurrentMonth }" isToday="{ cell.isToday }" isSelected="{ cell.isSelected }" onPpat="{ handleCellPpat }")
  script.
    import '../../atoms/viron-datepicker/cell.tag';
    import script from './index';
    this.external(script);
