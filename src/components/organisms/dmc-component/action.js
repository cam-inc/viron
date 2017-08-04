import { constants as actions } from '../../../store/actions';
import '../../organisms/dmc-operation/index.tag';

export default function() {
  const store = this.riotx.get();

  this.label = this.opts.action.summary || this.opts.action.operationId;

  this.handleButtonPat = () => {
    store.action(actions.DRAWERS_ADD, 'dmc-operation', {
      operationObject: this.opts.action,
      onSuccess: () => {
        this.opts.updater();
      }
    });
  };
}
