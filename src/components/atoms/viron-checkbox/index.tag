viron-checkbox(class="Checkbox { opts.ischecked ? 'Checkbox--checked' : '' } { opts.isdisabled ? 'Checkbox--disabled' : ''}" onClick="{ handleClick }")
  .Checkbox__content
    .Checkbox__mark
      viron-icon(type="check")
    virtual(if="{ !!opts.label }")
      .Checkbox__label { opts.label }

  script.
    import '../../atoms/viron-icon/index.tag';
    import script from './index';
    this.external(script);
