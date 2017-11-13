import { constants as actions } from '../../../../../store/actions';
import '../../../../../components/viron-error/index.tag';

export default function() {
  const store = this.riotx.get();

  this.memo = this.opts.endpoint.memo;

  this.handleMemoChange = newMemo => {
    this.memo = newMemo;
    this.update();
  };

  this.handleSaveButtonSelect = () => {
    Promise
      .resolve()
      .then(() => store.action(actions.ENDPOINTS_UPDATE, this.opts.endpoint.key, {
        memo: this.memo
      }))
      .then(() => store.action(actions.TOASTS_ADD, {
        message: '保存完了。'
      }))
      .then(() => {
        this.close();
      })
      .catch(err => store.action(actions.MODALS_ADD, 'viron-error', {
        error: err
      }));
  };

  this.handleCancelButtonSelect = () => {
    this.close();
  };
}
