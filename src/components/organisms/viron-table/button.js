
export default function() {
  const store = this.riotx.get();

  // icon種類。
  this.icon = this.opts.icon;
  // actionの場合はmethodから判定する。
  if (this.opts.isaction) {
    const method = store.getter('oas.pathItemObjectMethodNameByOperationId', this.opts.action.operationId);
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

  this.handleClick = () => {
    if (this.opts.isaction) {
      this.opts.onclick(this.opts.action);
    } else {
      this.opts.onclick();
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
