import contains from 'mout/array/contains';
import { constants as actions } from '../../../store/actions';
import '../../atoms/dmc-prettyprint/index.tag';

export default function() {
  const store = this.riotx.get();

  this.value = null;
  this.isComplex = false;
  this.isImage = false;
  switch (this.opts.data.type) {
  case 'null':
    this.value = 'null';
    break;
  case 'boolean':
    this.value = this.opts.data.cell ? 'true' : 'false';
    break;
  case 'number':
  case 'integer':
    this.value = String(this.opts.data.cell);
    break;
  case 'string': {
    this.value = this.opts.data.cell || '-';
    const split = this.value.split('.');
    if (!!split.length && contains(['jpg', 'png', 'gif'], split[split.length - 1])) {
      this.isImage = true;
    }
    break;
  }
  case 'object':
  case 'array':
    this.isComplex = true;
    break;
  default:
    this.value = '(no response)';
    break;
  }

  this.handleDetailPat = ()  => {
    store.action(actions.MODALS_ADD, 'dmc-prettyprint', {
      data : this.opts.data.cell
    });
  };
}
