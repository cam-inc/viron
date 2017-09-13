import { constants as actions } from '../../../store/actions';
import { constants as getters } from '../../../store/getters';
import '../../organisms/viron-component/operation.tag';

export default function() {
  const store = this.riotx.get();
  const operationObject = this.opts.action;

  this.label = operationObject.summary || operationObject.operationId;
  const method = store.getter(getters.OAS_PATH_ITEM_OBJECT_METHOD_NAME_BY_OPERATION_ID, operationObject.operationId);
  this.icon = null;
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

  this.handleButtonPat = () => {
    store.action(actions.DRAWERS_ADD, 'viron-component-operation', {
      title: operationObject.summary || operationObject.operationId,
      description: operationObject.description,
      method,
      operationObject,
      parameterObjects: operationObject.parameters,
      initialParameters: {},
      onComplete: () => {
        this.opts.updater();
      }
    });
  };
}
