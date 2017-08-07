dmc-datepicker.Datepicker
  .Datepicker__label(if="{ !!opts.label }") { opts.label }
  form(ref="form" onSubmit="{ handleFormSubmit }")
    input.Datepicker__input(onclick="{ toggle }" value="{ opts.text }" placeholder="{ opts.placeholder || '' }" pattern="{ opts.pattern }" onInput="{ handleInputInput }" onChange="{ handleInputChange }")
    .Datepicker__calendar(if="{ isShow }")
      .Datapicker__head
        span.Datapicker__trans(onclick="{ this.goPrev }") <
        span.Datapicker__month { dates.year() } 
          b { context.month[lang][dates.month()] }
        span.Datapicker__trans(onclick="{ this.goNext }") >
      .Datapicker__days
        span(each="{ day, index in context.days[lang] }" class="{ (index == 0) ? 'Datapicker__days--sunday' : '' } { (index == 6) ? 'Datapicker__days--saturday' : '' }") { day }
      .Datapicker__container

        .Datapicker__cell(each="{ cell in context.calendar }") { cell.value }
  script.
    import script from './index';
    this.external(script);