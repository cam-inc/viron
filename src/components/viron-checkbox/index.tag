viron-checkbox.Checkbox(class="{ 'Checkbox--checked': opts.ischecked, 'Checkbox--preview': opts.ispreview, 'Checkbox--error': opts.iserror, 'Checkbox--disabled': opts.isdisabled } Checkbox--{ opts.theme }" onTap="{ handleTap }")
  .Checkbox__content
    .Checkbox__mark
      viron-icon-check
    .Checkbox__label(if="{ !!opts.label }") { opts.label }
      .Checkbox__description(if="{ !!opts.description }") { opts.description }
  .Checkbox__blocker(if="{ opts.ispreview }" onTap="{ handleBlockerTap }")

  script.
    import '../../components/icons/viron-icon-check/index.tag';
    import script from './index';
    this.external(script);
