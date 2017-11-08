import contains from 'mout/array/contains';
import find from 'mout/array/find';
import forEach from 'mout/array/forEach';
import map from 'mout/array/map';
import reject from 'mout/array/reject';

export default function() {
  const selectedTableColumns = (this.opts.selectedTableColumns || []).concat([]);

  this.items = [];
  forEach(this.opts.tableColumns, tableColumn => {
    const item = {
      label: tableColumn,
      isSelected: contains(selectedTableColumns, tableColumn)
    };
    this.items.push(item);
  });

  this.handleItemToggle = (item, newIsSelected) => {
    const targetItem = find(this.items, i => {
      return (i.label === item.label);
    });
    if (!!targetItem) {
      targetItem.isSelected = newIsSelected;
      this.update();
    }
  };

  this.handleApplyButtonClick = () => {
    const newSelectedTableColumns = map(reject(this.items, item => {
      return !item.isSelected;
    }), item => {
      return item.label;
    });
    this.opts.onComplete(newSelectedTableColumns);
    this.close();
  };
}
