dmc-datepicker.Datepicker
  .Datepicker__label(if="{ !!opts.label }") { opts.label }
  form.Datapicker__form(ref="form" onSubmit="{ handleFormSubmit }")
    input.Datepicker__input(onTap="handleTap" ref="touch" value="{ opts.date }" placeholder="{ opts.placeholder || '' }" readonly="readonly" pattern="{ opts.pattern }" onInput="{ handleInputInput }" onChange="{ handleInputChange }")
    .Datepicker__calendar(if="{ opts.isshown }")
      .Datapicker__head
        span.Datapicker__transition(onclick="{ handlePrevButtonPat }") <
        span.Datapicker__month { displayDate.year() } 
          b { settingDateName.month[opts.language || 'ja'][displayDate.month()] }
        span.Datapicker__transition(onclick="{ handleNextButtonPat }") >
      .Datapicker__days
        span(each="{ day, index in settingDateName.days[opts.language || 'ja'] }" class="{ (index == 0) ? 'Datapicker__days--sunday' : '' } { (index == 6) ? 'Datapicker__days--saturday' : '' }") { day }
      .Datapicker__container
        virtual(each="{ cell in generateCalendar() }")
          dmc-datepicker-cell(date="{ cell }" onCellPat="{ handleCellPat }")
  script.
    import '../../atoms/dmc-datepicker/cell.tag';
    import script from './index';
    this.external(script);