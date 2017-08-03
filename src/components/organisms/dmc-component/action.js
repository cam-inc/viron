import swagger from '../../../core/swagger';
import { constants as actions } from '../../../store/actions';
import '../../organisms/dmc-operation/index.tag';

export default function() {
  const store = this.riotx.get();

  this.label = this.opts.action.summary;
  if (!this.label) {
    const obj = swagger.getMethodAndPathByOperationID(this.opts.action.operationId);
    this.label = `${obj.method} ${obj.path}`;
  }

  this.handleButtonPat = () => {
    store.action(actions.DRAWERS_ADD, 'dmc-operation', {
      operation: this.opts.action,
      onSuccess: () => {
        this.opts.updater();
      }
    });
  };
}
