import { getComponentStateName } from '../../../store/states';

export default function() {
  this.componentId = getComponentStateName(this._riot_id);
  // 縦横何個分のcellを使うのか。
  this.columnSize = 'columnSpreadSmall';
  this.rowSize = 'rowSpreadSmall';
  switch (this.opts.def.style) {
  case 'graph-bar':
  case 'graph-horizontal-bar':
  case 'graph-horizontal-stacked-bar':
  case 'graph-line':
  case 'graph-scatterplot':
  case 'graph-stacked-area':
  case 'graph-stacked-bar':
    this.columnSize = 'columnSpreadSmall';
    this.rowSize = 'rowSpreadMedium';
    break;
  case 'table':
    this.columnSize = 'columnSpreadFull';
    this.rowSize = 'rowSpreadLarge';
    break;
  case 'number':
  default:
    this.columnSize = 'columnSpreadSmall';
    this.rowSize = 'rowSpreadSmall';
    break;
  }

}
