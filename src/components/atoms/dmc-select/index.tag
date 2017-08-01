dmc-select.Select
  .Select__label(if="{ !!opts.label || opts.isrequired }") { opts.label }{ (opts.isrequired !== undefined) ? ' *' : '' }
  form.Select__content(onSubmit="{ handleFormSubmit }")
    select.Select__input(ref="select" onInput="{ handleInputInput }" onChange="{ handleInputChange }")
      option(each="{ option in opts.options }" selected="{ option.isSelected }" disabled="{ option.isDisabled }") { option.label }
    .Select__icon
      dmc-icon(type="down")

  script.
    import '../../atoms/dmc-icon/index.tag';
    import script from './index';
    this.external(script);
