import { constants as actions } from '../../../store/actions';
import '../../organisms/dmc-component/operation.tag';

export default function() {
  const store = this.riotx.get();
  const operationObject = this.opts.action;

  this.label = operationObject.summary || operationObject.operationId;

  this.handleButtonPat = () => {
    store.action(actions.DRAWERS_ADD, 'dmc-component-operation', {
      title: operationObject.summary || operationObject.operationId,
      description: operationObject.description,
      operationObject,
      parameterObjects: operationObject.parameters,
      initialParameters: {},
      onComplete: () => {
        this.opts.updater();
      }
    });
  };
}
