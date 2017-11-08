import ObjectAssign from 'object-assign';
import { constants as actions } from '../../../store/actions';
import '../../atoms/viron-message/index.tag';

export default function() {
  const store = this.riotx.get();

  // submitボタンに使用するラベル。method名によって内容を変える。
  this.submitButtonLabel = null;
  // cancelボタンに使用するタイプ。method名によって内容を変える。
  this.submitButtonType = 'primary';
  switch (this.opts.method) {
  case 'get':
    this.submitButtonLabel = '取得する';
    break;
  case 'post':
    this.submitButtonLabel = '新規追加する';
    break;
  case 'put':
    this.submitButtonLabel = '変更する';
    this.submitButtonType = 'emphasis';
    break;
  case 'delete':
    this.submitButtonLabel = '削除する';
    this.submitButtonType = 'emphasis';
    break;
  default:
    this.submitButtonLabel = '送信する';
    break;
  }

  // 現在の入力値群。
  this.currentParameters = ObjectAssign({}, this.opts.initialParameters);

  // 補完的な情報群。primaryキー等。
  this.additionalInfo = {
    method: this.opts.method,
    primaryKey: this.opts.primaryKey
  };

  this.handleParametersChange = newParameters => {
    this.currentParameters = newParameters;
    this.update();
  };

  this.handleSubmitButtonClick = () => {
    Promise
      .resolve()
      .then(() => store.action(actions.COMPONENTS_OPERATE_ONE, this.opts.operationObject, this.currentParameters))
      .then(() => {
        this.opts.onComplete();
        this.close();
      })
      .catch(err => {
        // 401 = 認証エラー
        // 通常エラーと認証エラーで処理を振り分ける。
        if (err.status !== 401) {
          return store.action(actions.MODALS_ADD, 'viron-message', {
            message: `APIパラメータやOASが正しいか確認して下さい。[${this.opts.operationObject.summary || ''}]`,
            error: err
          });
        }
        return Promise
          .resolve()
          .then(() => store.action(actions.MODALS_ADD, 'viron-message', {
            title: '認証切れ',
            message: '認証が切れました。再度ログインして下さい。'
          }))
          .then(() => {
            this.getRouter().navigateTo('/');
          });
      });
  };

  this.handleCancelButtonClick = () => {
    this.close();
  };
}
