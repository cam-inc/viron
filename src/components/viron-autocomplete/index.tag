viron-autocomplete.Autocomplete
  .Autocomplete__label(if="{ !!opts.label }") { opts.label }
  form(onSubmit="{ handleFormSubmit }")
    input.Autocomplete__input(type="text" ref="input" list="{ _riot_id }" onInput="{ handleInputInput }" onChange="{ handleInputChange }")
  datalist(id="{ _riot_id }")
    option(each="{ opt in options }" value="{ opt.value }") { opt.name }

  script.
    import script from './index';
    this.external(script);
