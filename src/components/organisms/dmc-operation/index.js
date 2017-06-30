import ObjectAssign from 'object-assign';
import swagger from '../../../core/swagger';
import { constants as actions } from '../../../store/actions';
import '../../atoms/dmc-message/index.tag';

export default function() {
  const store = this.riotx.get();

  this.summary = this.opts.operation.summary;
  if (!this.summary) {
    const obj = swagger.getMethodAndPathByOperationID(this.opts.operation.operationId);
    this.summary = `${obj.method} ${obj.path}`;
  }
  this.queries = ObjectAssign({}, this.opts.initialQueries);

  this.handleParameterChange = (key, value) => {
    this.queries[key] = value;
    // TODO: deleteするためのもっと良い方法を模索すること。
    if (typeof value === 'string' && !value.length) {
      delete this.queries[key];
    }
    this.update();
  };

  this.handleExecuteButtonPat = () => {
    Promise
      .resolve()
      .then(() => store.action(actions.COMPONENTS_OPERATE_ONE, this.opts.operation, this.queries))
      .then(() => {
        this.close();
        this.opts.onSuccess();
      })
      .catch(err => store.action(actions.MODALS_ADD, 'dmc-message', {
        error: err
      }));
  };

  this.handleCancelButtonPat = () => {
    this.close();
  };
}
