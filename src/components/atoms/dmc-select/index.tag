dmc-select(class="Select { opts.isopened ? 'Select--opened' : '' } { opts.isdisabled ? 'Select--disabled' : '' }")
  .Select__box(ref="touch" onTap="handleBoxTap")
    .Select__label { getSelectedLabel() }
    .Select__icon
      dmc-icon(type="down")
  .Select__options
    virtual(each="{ opts.options }")
      div(class="Select__option { isSelected ? 'Select__option--selected' : ''  } { isDisabled ? 'Select__option--disabled' : '' }" data-id="{ id }" ref="touch" onTap="{ parent.handleOptionTap }")
        .Select__optionIcon
          dmc-icon(type="check")
        .Select__optionLabel { label }

  script.
    import '../../atoms/dmc-icon/index.tag';
    import script from './index';
    this.external(script);
