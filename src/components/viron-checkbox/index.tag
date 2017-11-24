viron-checkbox.Checkbox(class="{ 'Checkbox--checked': opts.ischecked }" onTap="{ handleTap }")
  .Checkbox__conent
    .Checkbox__mark
      viron-icon-check
    .Checkbox__label(if="{ !!opts.label }") { opts.label }

  script.
    import '../../components/icons/viron-icon-check/index.tag';
    import script from './index';
    this.external(script);
