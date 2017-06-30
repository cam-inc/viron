import find from 'mout/array/find';
import map from 'mout/array/map';

export default function() {
  this.getSelectedLabel = () => {
    const selectedOption = find(this.opts.options, { isSelected: true });
    if (!selectedOption) {
      return '-';
    }
    return selectedOption.label;
  };

  this.on('updated', () => {
    this.rebindTouchEvents();
  });

  this.handleBoxTap = () => {
    if (this.opts.isdisabled) {
      return;
    }
    this.opts.ontoggle && this.opts.ontoggle(!this.opts.isopened);
  };

  this.handleOptionTap = e => {
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
  };
}
