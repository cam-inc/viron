viron-select.Select(class="{ 'Select--small': opts.issmall, 'Select--disabled': opts.isdisabled, 'Select--preview': opts.ispreview, 'Select--error': opts.iserror } Select--{ opts.theme } { opts.class }")
  form.Select__form(onSubmit="{ handleFormSubmit }")
    select.Select__select(ref="select" disabled="{ opts.isdisabled }" onInput="{ handleSelectInput }" onChange="{ handleSelectChange }")
      option.Select__option(each="{ option in opts.options }" selected="{ option.isSelected }") { option.label }
    viron-icon-arrow-down.Select__icon(if="{ !opts.ispreview }")
  .Select__blocker(if="{ opts.ispreview }" onTap="{ handleBlockerTap }")

  script.
    import '../../components/icons/viron-icon-arrow-down/index.tag';
    import script from './index';
    this.external(script);
