import { getComponentStateName } from '../../../store/states';

export default function() {
  this.componentId = getComponentStateName(this._riot_id);
  this.cardType = null;
  // 縦横何個分のcellを使うのか。
  this.columnSize = 'columnSpreadSmall';
  this.rowSize = 'rowSpreadSmall';
  switch (this.opts.def.style) {
  case 'chart':
    // v1ではHighchartが使用されていたがライセンス上の問題で使用しないことに。
    // `chart` = highchart使用なのでサポート外である旨を示す。
    this.cardType = 'unsupported';
    this.columnSize = 'columnSpreadSmall';
    this.rowSize = 'rowSpreadMedium';
    break;
  case 'graph-scatterplot':
  case 'graph-line':
  case 'graph-bar':
  case 'graph-horizontal-bar':
  case 'graph-stacked-bar':
  case 'graph-horizontal-stacked-bar':
  case 'graph-stacked-area':
    this.cardType = 'chart';
    this.columnSize = 'columnSpreadSmall';
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
