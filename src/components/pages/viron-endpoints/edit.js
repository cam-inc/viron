import { constants as actions } from '../../../store/actions';

export default function() {
  const store = this.riotx.get();

  this.memo = this.opts.endpoint.memo || '';

  this.handleMemoChange = newMemo => {
    this.memo = newMemo;
    this.update();
  };

  this.handleEditButtonClick = () => {
    Promise
      .resolve()
      .then(() => store.action(actions.ENDPOINTS_UPDATE, this.opts.endpointKey, {
        memo: this.memo
      }))
      .then(() => store.action(actions.TOASTS_ADD, {
        message: 'エンドポイントを編集しました。'
      }))
      .then(() => {
        this.close();
      })
      .catch(err => store.action(actions.TOASTS_ADD, {
        type: 'error',
        message: err.message
      }));
  };

  this.handleCancelButtonClick = () => {
    this.close();
  };
}
