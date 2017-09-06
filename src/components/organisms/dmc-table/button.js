import { constants as getters } from '../../../store/getters';

export default function() {
  const store = this.riotx.get();

  // icon種類。
  this.icon = this.opts.icon;
  // actionの場合はmethodから判定する。
  if (this.opts.isaction) {
    const method = store.getter(getters.OAS_PATH_ITEM_OBJECT_METHOD_NAME_BY_OPERATION_ID, this.opts.action.operationId);
    switch (method) {
    case 'get':
      this.icon = 'download';
      break;
    case 'post':
      this.icon = 'plusSquareO';
      break;
    case 'put':
      this.icon = 'edit';
      break;
    case 'delete':
      this.icon = 'closeSquareO';
      break;
    default:
      break;
    }
  }

  // tooltip表示中か否か。
  this.isTooltipVisible = false;
  // tooltip内に表示するテキスト。
  this.tooltipLabel = null;
  if (this.opts.isaction) {
    this.tooltipLabel = this.opts.action.value;
  }

  this.handleTap = () => {
    if (this.opts.isaction) {
      this.opts.onpat(this.opts.action);
    } else {
      this.opts.onpat();
    }
  };

  this.handleMouseOver = () => {
    if (!this.opts.isaction) {
      return;
    }
    this.isTooltipVisible = true;
    this.update();
  };

  this.handleMouseOut = () => {
    if (!this.opts.isaction) {
      return;
    }
    this.isTooltipVisible = false;
    this.update();
  };
}
