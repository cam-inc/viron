import swagger from '../../../core/swagger';
import { constants as actions } from '../../../store/actions';
import '../../organisms/dmc-operation/index.tag';

export default function() {
  const store = this.riotx.get();

  this.isTooltipOpened = false;
  this.label = this.opts.action.summary;
  if (!this.label) {
    const obj = swagger.getMethodAndPathByOperationID(this.opts.action.operationId);
    this.label = `${obj.method} ${obj.path}`;
  }
  this.tooltipMessage = this.opts.action.description;

  this.handleButtonPat = () => {
    store.action(actions.DRAWERS_ADD, 'dmc-component-operation', {
      operation: this.opts.action,
      onSuccess: () => {
        this.opts.updater();
      }
    });
  };

  this.handleButtonHoverToggle = isHovered => {
    if (!this.tooltipMessage) {
      return;
    }
    this.isTooltipOpened = isHovered;
    this.update();
  };
}
