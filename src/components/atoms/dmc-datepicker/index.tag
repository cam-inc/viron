dmc-datepicker.Datepicker
  .Datepicker__label(if="{ !!opts.label }") { opts.label }
  form(ref="form" onSubmit="{ handleFormSubmit }")
    input.Datepicker__input(onclick="{ this.toggle }" type="{ opts.type || 'text' }" value="{ opts.text }" placeholder="{ opts.placeholder || '' }" pattern="{ opts.pattern }" onInput="{ handleInputInput }" onChange="{ handleInputChange }")
    .Datepicker__calendar(if="{ isShow }")
      .Datapicker__head
        span.Datapicker__trans(onclick="{ this.goPrev }") <
        span.Datapicker__month { context.month[lang][dates.month()] } 
          i {dates.year() }
        span.Datapicker__trans(onclick="{ this.goNext }") >
      .Datapicker__days
        span(each="{ day in context.days[lang] }") { day }
      .Datapicker__container

        .Datapicker__cell(each="{ cell in context.calendar }") { cell.value }
  script.
    import script from './index';
    this.external(script);