import { constants as actions } from '../store/actions';
import '../components/atoms/dmc-message/index.tag';

export default function() {
  const store = this.riotx.get();

  // ドラッグ開始時の処理。
  this.handleDragStart = e => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.opts.endpoint.key);

    Promise
      .resolve()
      .then(() => store.action(actions.APPLICATION_DRAG_START))
      .catch(err => store.action(actions.MODALS_ADD, 'dmc-message', {
        error: err
      }));
  };

  // ドラッグしている間の処理。
  this.handleDrag = () => {
  };

  // ドラッグ終了時の処理。
  this.handleDragEnd = () => {
    Promise
      .resolve()
      .then(() => store.action(actions.APPLICATION_DRAG_END))
      .catch(err => store.action(actions.MODALS_ADD, 'dmc-message', {
        error: err
      }));
  };
}
