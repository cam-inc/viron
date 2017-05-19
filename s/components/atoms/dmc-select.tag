dmc-select(class="Select { opts.isopened ? 'Select--opened' : '' } { opts.isdisabled ? 'Select--disabled' : '' }")
  .Select__box(onClick="{ handleBoxClick }")
    .Select__label { getSelectedLabel() }
    .Select__icon
      dmc-icon(type="down")
  .Select__options
    virtual(each="{ opts.options }")
      div(class="Select__option { isSelected ? 'Select__option--selected' : ''  } { isDisabled ? 'Select__option--disabled' : '' }" data-id="{ id }" onClick="{ parent.handleOptionClick }")
        .Select__optionIcon
          dmc-icon(type="check")
        .Select__optionLabel { label }

  script.
    import { find, map } from 'mout/array';
    import '../atoms/dmc-icon.tag';

    this.on('mount', () => {
      window.addEventListener('click', this.handleOutsideClick);
    });

    this.on('unmount', () => {
      window.removeEventListener('click', this.handleOutsideClick);
    });

    getSelectedLabel() {
      const selectedOption = find(this.opts.options, { isSelected: true });
      if (!selectedOption) {
        return '-';
      }
      return selectedOption.label;
    }

    handleOutsideClick() {
      this.opts.ontoggle && this.opts.ontoggle(false);
    }

    handleBoxClick(e) {
      e.preventUpdate = false;
      if (this.opts.isdisabled) {
        return;
      }
      this.opts.ontoggle && this.opts.ontoggle(!this.opts.isopened);
    }

    handleOptionClick(e) {
      e.preventUpdate = false;
      const selectedOptionID = e.currentTarget.dataset.id;
      const options = map(this.opts.options, option => {
        if (option.id === selectedOptionID) {
          option.isSelected = true;
        } else {
          option.isSelected = false;
        }
        return option;
      });
      this.opts.onchange && this.opts.onchange(options);
      this.opts.ontoggle && this.opts.ontoggle(false);
    }
