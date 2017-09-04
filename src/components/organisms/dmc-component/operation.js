import ObjectAssign from 'object-assign';
import { constants as actions } from '../../../store/actions';
import '../../atoms/dmc-message/index.tag';

export default function() {
  const store = this.riotx.get();

  // submitボタンに使用するラベル。method名によって内容を変える。
  this.submitButtonLabel = null;
  switch (this.opts.method) {
  case 'get':
    this.submitButtonLabel = '取得する';
    break;
  case 'post':
    this.submitButtonLabel = '新規追加する';
    break;
  case 'put':
    this.submitButtonLabel = '変更する';
    break;
  case 'delete':
    this.submitButtonLabel = '削除する';
    break;
  default:
    this.submitButtonLabel = '送信する';
    break;
  }

  this.currentParameters = ObjectAssign({}, this.opts.initialParameters);

  this.handleParametersChange = newParameters => {
    this.currentParameters = newParameters;
    this.update();
  };

  this.handleSubmitButtonPat = () => {
    Promise
      .resolve()
      .then(() => store.action(actions.COMPONENTS_OPERATE_ONE, this.opts.operationObject, this.currentParameters))
      .then(() => {
        this.opts.onComplete();
        this.close();
      })
      .catch(err => store.action(actions.MODALS_ADD, 'dmc-message', {
        message: `APIパラメータやOASが正しいか確認して下さい。[${this.opts.operationObject.summary || ''}]`,
        error: err
      }));
  };

  this.handleCancelButtonPat = () => {
    this.close();
  };
}
