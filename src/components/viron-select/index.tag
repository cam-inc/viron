viron-select.Select(class="{ 'Select--disabled': opts.isdisabled, 'Select--error': opts.haserror }")
  form.Select__form(onSubmit="{ handleFormSubmit }")
    select.Select__select(ref="select" disabled="{ opts.isdisabled }" onInput="{ handleSelectInput }" onChange="{ handleSelectChange }")
      option.Select__option(each="{ option in opts.options }" selected="{ option.isSelected }") { option.label }
    viron-icon-arrow-down.Select__icon

  script.
    import '../../components/icons/viron-icon-arrow-down/index.tag';
    import script from './index';
    this.external(script);
