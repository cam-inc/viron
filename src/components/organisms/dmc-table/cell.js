import { constants as actions } from '../../../store/actions';
import '../../atoms/dmc-prettyprint/index.tag';

export default function() {
  const store = this.riotx.get();

  this.value = null;
  switch (this.opts.cell.getType()) {
  case 'null':
    this.value = 'null';
    break;
  case 'boolean':
    this.value = this.opts.cell.getValue() ? 'O' : 'X';
    break;
  case 'number':
  case 'integer':
    this.value = String(this.opts.cell.getValue());
    break;
  case 'string':
    // TODO: 画像表示
    this.value = this.opts.cell.getValue() || '-';
    break;
  case 'object':
  case 'array':
    this.value = '[詳細を見る]';
    break;
  default:
    break;
  }

  this.handleTap = ()  => {
    const type = this.opts.cell.getType();
    if (type !== 'object' && type !== 'array') {
      return;
    }
    store.action(actions.MODALS_ADD, 'dmc-prettyprint', {
      data : this.opts.cell.getRawValue()
    });
  };
}
