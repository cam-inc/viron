import ObjectAssign from 'object-assign';
import { constants as actions } from '../../../store/actions';
import '../../atoms/dmc-message/index.tag';

export default function() {
  const store = this.riotx.get();

  this.summary = this.opts.operationObject.summary || this.opts.operationObject.operationId;
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
      .then(() => store.action(actions.COMPONENTS_OPERATE_ONE, this.opts.operationObject, this.queries))
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
