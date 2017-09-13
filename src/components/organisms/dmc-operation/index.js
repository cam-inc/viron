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
      .catch(err => {
        // 401 = 認証エラー
        // 通常エラーと認証エラーで処理を振り分ける。
        if (err.status !== 401) {
          return store.action(actions.MODALS_ADD, 'dmc-message', {
            message: `APIパラメータやOASが正しいか確認して下さい。[${this.opts.operationObject.summary || ''}]`,
            error: err
          });
        }
        return Promise
          .resolve()
          .then(() => store.action(actions.MODALS_ADD, 'dmc-message', {
            title: '認証切れ',
            message: '認証が切れました。再度ログインして下さい。'
          }))
          .then(() => {
            this.getRouter().navigateTo('/');
          });
      });
  };

  this.handleCancelButtonPat = () => {
    this.close();
  };
}
