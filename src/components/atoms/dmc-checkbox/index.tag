dmc-checkbox(class="Checkbox { opts.ischecked ? 'Checkbox--checked' : '' } { opts.isdisabled ? 'Checkbox--disabled' : ''}" ref="touch" onTap="handleTap")
  .Checkbox__content
    .Checkbox__mark
      dmc-icon(type="check")
    virtual(if="{ !!opts.label }")
      .Checkbox__label { opts.label }

  script.
    import '../../atoms/dmc-icon/index.tag';
    import script from './index';
    this.external(script);
