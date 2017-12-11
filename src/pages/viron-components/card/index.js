import { getComponentStateName } from '../../../store/states';

export default function() {
  this.componentId = getComponentStateName(this._riot_id);
  this.cardType = null;
  // 縦横何個分のcellを使うのか。
  this.columnSize = 'columnSpreadSmall';
  this.rowSize = 'rowSpreadSmall';
  switch (this.opts.def.style) {
  case 'chart':
  case 'graph-bar':
  case 'graph-horizontal-bar':
  case 'graph-horizontal-stacked-bar':
  case 'graph-line':
  case 'graph-scatterplot':
  case 'graph-stacked-area':
  case 'graph-stacked-bar':
    this.cardType = 'chart';
    //this.columnSize = 'columnSpreadSmall';
    this.columnSize = 'columnSpreadFull';
    this.rowSize = 'rowSpreadMedium';
    break;
  case 'table':
    this.cardType = 'table';
    this.columnSize = 'columnSpreadFull';
    this.rowSize = 'rowSpreadLarge';
    break;
  case 'number':
    this.cardType = 'number';
    this.columnSize = 'columnSpreadSmall';
    this.rowSize = 'rowSpreadSmall';
    break;
  default:
    break;
  }
}
