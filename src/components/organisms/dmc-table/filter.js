import find from 'mout/array/find';
import forEach from 'mout/array/forEach';
import map from 'mout/array/map';
import remove from 'mout/array/remove';

export default function() {
  this.items = map(this.opts.options, option => {
    return {
      label: option,
      id: option,
      isChecked: find(this.opts.selectedOptions, selectedOption => {
        return (selectedOption === option);
      })
    };
  });
  this.selectedItems = [].concat(this.opts.selectedOptions);

  this.handleCheckboxChange = (isChecked, id) => {
    if (isChecked) {
      this.selectedItems.push(id);
    } else {
      remove(this.selectedItems, id);
    }
    forEach(this.items, item => {
      if (item.id !== id) {
        return;
      }
      item.isChecked = isChecked;
    });
    this.update();
    this.opts.onChange(this.selectedItems);
  };
}
