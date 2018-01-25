viron-autocomplete.Autocomplete(class="{ 'Autocomplete--disabled': opts.isdisabled, 'Autocomplete--preview': opts.ispreview, 'Autocomplete--error': opts.iserror }")
  .Autocomplete__label(if="{ !!opts.label }") { opts.label }
  form(onSubmit="{ handleFormSubmit }")
    input.Autocomplete__input(type="text" value="{ opts.val }" ref="input" list="{ _riot_id }" disabled="{ opts.isdisabled }" onInput="{ handleInputInput }" onChange="{ handleInputChange }" onFocus="{ handleInputFocus }" onBlur="{ handleInputBlur }")
  datalist(id="{ _riot_id }")
    option(each="{ opt in options }" value="{ opt.value }") { opt.name }
  .Autocomplete__blocker(if="{ opts.ispreview }" onTap="{ handleBlockerTap }")

  script.
    import script from './index';
    this.external(script);
