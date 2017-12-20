import reject from 'mout/array/reject';
import ObjectAssign from 'object-assign';
import exporter from './exporter';

export default exporter('application', {
  /**
   * 起動ステータスを変更します。
   * @param {Object} state
   * @param {Boolean} bool
   * @return {Array}
   */
  launch: (state, bool) => {
    state.application.isLaunched = bool;
    return ['application'];
  },

  /**
   * 画面遷移ステータスを変更します。
   * @param {Object} state

   * @param {Boolean} bool
   * @return {Array}
   */
  navigation: (state, bool) => {
    state.application.isNavigating = bool;
    return ['application'];
  },

  /**
   * 通信中APIを追加します。
   * @param {Object} state
   * @param {Object} info
   * @return {Array}
   */
  addNetworking: (state, info) => {
    state.application.networkings.push(ObjectAssign({
      id: `networking_${Date.now()}`
    }, info));
    state.application.isNetworking = true;
    return ['application'];
  },

  /**
   * 通信中APIを削除します。
   * @param {Object} state
   * @param {String} networkingId
   * @param {riotx.Context} context
   * @return {Array}
   */
  removeNetworking: (state, networkingId, context) => {
    state.application.networkings = reject(state.application.networkings, networking => {
      return (networking.id === networkingId);
    });
    if (!!context) {
      // 意図的に通信状態チェックを遅らせます。
      setTimeout(() => {
        context.commit('application.isNetworking');
      }, 500);
    } else if (!state.application.networkings.length) {
      state.application.isNetworking = false;
    }
    return ['application'];
  },

  /**
   * 通信状態を更新します。
   * @param {Object} state
   * @return {Array}
   */
  isNetworking: state => {
    state.application.isNetworking = !!state.application.networkings.length;
    return ['application'];
  },

  /**
   * ドラッグステータスを変更します。
   * @param {Object} state
   * @param {Boolean} bool
   * @return {Array}
   */
  drag: (state, bool) => {
    state.application.isDragging = bool;
    return ['application'];
  },

  /**
   * メニューの開閉状態を切り替えます。
   * @param {Object} state
   * @return {Array}
   */
  menuToggle: state => {
    state.application.isMenuOpened = !state.application.isMenuOpened;
    return ['application'];
  },

  /**
   * エンドポイント用のフィルターテキストを更新します。
   * @param {Object} state
   * @param {String} newFilterText
   * @return {Array}
   */
  endpointFilterText: (state, newFilterText) => {
    state.application.endpointFilterText = newFilterText;
    return ['application'];
  },

  /**
   * エンドポイント用の一時フィルターテキストを更新します。
   * @param {Object} state
   * @param {String} newTempFilterText
   * @return {Array}
   */
  endpointTempFilterText: (state, newTempFilterText) => {
    state.application.endpointTempFilterText = newTempFilterText;
    return ['application'];
  }
});
