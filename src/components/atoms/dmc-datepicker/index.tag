dmc-datepicker.Datepicker
  .Datepicker__label(if="{ !!opts.label }") { opts.label }
  form(ref="form" onSubmit="{ handleFormSubmit }")
    input.Datepicker__input(onclick="{ toggle }" value="{ opts.text }" placeholder="{ opts.placeholder || '' }" pattern="{ opts.pattern }" onInput="{ handleInputInput }" onChange="{ handleInputChange }")
    .Datepicker__calendar(if="{ isShown }")
      .Datapicker__head
        span.Datapicker__trans(onclick="{ this.goPrev }") <
        span.Datapicker__month { dates.year() } 
          b { data.month[lang][dates.month()] }
        span.Datapicker__trans(onclick="{ this.goNext }") >
      .Datapicker__days
        span(each="{ day, index in data.days[lang] }" class="{ (index == 0) ? 'Datapicker__days--sunday' : '' } { (index == 6) ? 'Datapicker__days--saturday' : '' }") { day }
      .Datapicker__container
        .Datapicker__cell(onclick="{ handleDateInput }" each="{ cell in data.calendar }" class="{ (cell.date.month() !== dates.month()) ? 'Datapicker__cell--secondary' : '' } { ( this.format(cell.date) === this.format(today) ) ? 'Datapicker__cell--today' : '' } { ( this.format(cell.date) === this.format(this.selectedDate) ) ? 'Datapicker__cell--select' : '' }") { cell.date.date() }
  script.
    import script from './index';
    this.external(script);