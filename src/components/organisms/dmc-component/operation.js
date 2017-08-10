import ObjectAssign from 'object-assign';
import { constants as actions } from '../../../store/actions';
import '../../atoms/dmc-message/index.tag';

export default function() {
  const store = this.riotx.get();

  this.currentParameters = ObjectAssign({}, this.opts.initialParameters);

  this.handleParametersChange = newParameters => {
    this.currentParameters = newParameters;
    this.update();
  };

  this.handleSubmitButtonPat = () => {
    Promise
      .resolve()
      .then(() => {
        const currentParameters = this.currentParameters;
        debugger
      })
      .then(() => store.action(actions.COMPONENTS_OPERATE_ONE, this.opts.operationObject, this.currentParameters))
      .then(() => {
        this.opts.onComplete();
        this.close();
      })
      .catch(err => store.action(actions.MODALS_ADD, 'dmc-message', {
        error: err
      }));
  };

  this.handleCancelButtonPat = () => {
    this.close();
  };
}
