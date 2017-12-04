import contains from 'mout/array/contains';
import filter from 'mout/array/filter';
import find from 'mout/array/find';
import map from 'mout/array/map';
import deepClone from 'mout/lang/deepClone';
import ObjectAssign from 'object-assign';

export default function() {
  const selectedColumnKeys = this.opts.selectedColumnKeys;
  this.columns = map(deepClone(this.opts.columns), column => {
    let isSelected;
    // selectedColumnがnullやundefinedの時は全選択状態と判定する。
    if (!selectedColumnKeys || contains(selectedColumnKeys, column.key)) {
      isSelected = true;
    }
    return ObjectAssign(column, {
      isSelected
    });
  });

  this.handleItemChange = (newIsSelected, key) => {
    const target = find(this.columns, column => {
      return (column.key === key);
    });
    if (!!target) {
      target.isSelected = newIsSelected;
    }
    this.update();
  };

  this.handleApplyButtonTap = () => {
    if (!this.opts.onChange) {
      this.close();
      return;
    }
    const newSelectedColumnKeys = map(filter(this.columns, column => {
      return column.isSelected;
    }), column => {
      return column.key;
    });
    this.opts.onChange(newSelectedColumnKeys);
    this.close();
  };
}
