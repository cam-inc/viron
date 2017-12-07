import contains from 'mout/array/contains';
import filter from 'mout/array/filter';
import find from 'mout/array/find';
import map from 'mout/array/map';
import deepClone from 'mout/lang/deepClone';
import ObjectAssign from 'object-assign';

export default function() {
  const store = this.riotx.get();

  this.isApplyButtonDisabled = false;
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
  // 全選択ボタンの活性状態。
  // 全て選択されている場合はnullを返す。
  this.isAllSelected = (!selectedColumnKeys || selectedColumnKeys.length === this.columns.length);
  this.layoutType = store.getter('layout.type');
  // モバイル用レイアウトか否か。
  this.isMobile = store.getter('layout.isMobile');

  this.listen('layout', () => {
    this.layoutType = store.getter('layout.type');
    this.isMobile = store.getter('layout.isMobile');
    this.update();
  });

  this.handleCloseButtonTap = () => {
    this.close();
  };

  this.handleAllSelectChange = newIsChecked => {
    this.isAllSelected = newIsChecked;
    map(this.columns, column => {
      column.isSelected = newIsChecked;
      return column;
    });
    // 全て未選択の時はボタン非活性化。
    if (!find(this.columns, column => {
      return column.isSelected;
    })) {
      this.isApplyButtonDisabled = true;
    } else {
      this.isApplyButtonDisabled = false;
    }
    this.update();
  };

  this.handleItemChange = (newIsSelected, key) => {
    const target = find(this.columns, column => {
      return (column.key === key);
    });
    if (!!target) {
      target.isSelected = newIsSelected;
    }
    // 全て未選択の時はボタン非活性化。
    if (!find(this.columns, column => {
      return column.isSelected;
    })) {
      this.isApplyButtonDisabled = true;
    } else {
      this.isApplyButtonDisabled = false;
    }
    // 全て選択されている時は全選択ボタン活性化。
    if (find(this.columns, column => {
      return !column.isSelected;
    })) {
      this.isAllSelected = false;
    } else {
      this.isAllSelected = true;
    }
    this.update();
  };

  this.handleApplyButtonTap = () => {
    if (!this.opts.onChange) {
      return;
    }
    let newSelectedColumnKeys = map(filter(this.columns, column => {
      return column.isSelected;
    }), column => {
      return column.key;
    });
    // 全て選択されている場合はnullを返す。
    if (newSelectedColumnKeys.length === this.columns.length) {
      newSelectedColumnKeys = null;
    }
    this.opts.onChange(newSelectedColumnKeys);
    if (this.isMobile) {
      this.close();
    }
  };
}
