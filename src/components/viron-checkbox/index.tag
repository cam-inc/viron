viron-checkbox.Checkbox(class="{ 'Checkbox--checked': opts.ischecked, 'Checkbox--error': opts.iserror, 'Checkbox--disabled': opts.isdisabled } Checkbox--{ opts.theme }" onTap="{ handleTap }")
  .Checkbox__content
    .Checkbox__mark
      viron-icon-check
    .Checkbox__label(if="{ !!opts.label }") { opts.label }

  script.
    import '../../components/icons/viron-icon-check/index.tag';
    import script from './index';
    this.external(script);
