import { constants as actions } from '../store/actions';
import '../components/atoms/viron-message/index.tag';

export default function() {
  const store = this.riotx.get();

  // ドロップ待受中か否か。
  this.isWatching = store.getter('application.isDragging');
  // ドロップ可能な状態か否か。
  this.isDroppable = false;

  this.listen('application', () => {
    this.isWatching = store.getter('application.isDragging');
    this.update();
  });

  // ドラッグしている要素がドロップ領域に入った時の処理。
  this.handleDragEnter = e => {
    e.preventDefault();
    this.isDroppable = true;
    this.update();
  };

  // ドラッグしている要素がドロップ領域にある間の処理。
  this.handleDragOver = e => {
    e.preventDefault();
  };

  // ドラッグしている要素がドロップ領域から出た時の処理。
  this.handleDragLeave = () => {
    this.isDroppable = false;
    this.update();
  };

  // ドラッグしている要素がドロップ領域にドロップされた時の処理。
  this.handleDrop = e => {
    this.isDroppable = false;
    this.update();

    const endpointKey = e.dataTransfer.getData('text/plain');
    const newOrder = this.opts.order;
    Promise
      .resolve()
      .then(() => store.action(actions.ENDPOINTS_CHANGE_ORDER, endpointKey, newOrder))
      .catch(err => store.action(actions.MODALS_ADD, 'viron-message', {
        error: err
      }));
  };
}
