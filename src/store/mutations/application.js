import reject from 'mout/array/reject';
import ObjectAssign from 'object-assign';
import { constants as states } from '../states';

export default {
  /**
   * 起動ステータスを変更します。
   * @param {riotx.Context} context
   * @param {Boolean} bool
   * @return {Array}
   */
  launch: (context, bool) => {
    context.state.application.isLaunched = bool;
    return [states.APPLICATION];
  },

  /**
   * 画面遷移ステータスを変更します。
   * @param {riotx.Context} context
   * @param {Boolean} bool
   * @return {Array}
   */
  navigation: (context, bool) => {
    context.state.application.isNavigating = bool;
    return [states.APPLICATION];
  },

  /**
   * 通信中APIを追加します。
   * @param {riotx.Context} context
   * @param {Object} info
   * @return {Array}
   */
  addNetworking: (context, info) => {
    context.state.application.networkings.push(ObjectAssign({
      id: `networking_${Date.now()}`
    }, info));
    context.state.application.isNetworking = true;
    return [states.APPLICATION];
  },

  /**
   * 通信中APIを削除します。
   * @param {riotx.Context} context
   * @param {String} networkingId
   * @return {Array}
   */
  removeNetworking: (context, networkingId) => {
    context.state.application.networkings = reject(context.state.application.networkings, networking => {
      return (networking.id === networkingId);
    });
    if (!context.state.application.networkings.length) {
      context.state.application.isNetworking = false;
    }
    return [states.APPLICATION];
  },

  /**
   * ドラッグステータスを変更します。
   * @param {riotx.Context} context
   * @param {Boolean} bool
   * @return {Array}
   */
  drag: (context, bool) => {
    context.state.application.isDragging = bool;
    return [states.APPLICATION];
  },

  /**
   * メニューの開閉状態を切り替えます。
   * @param {riotx.Context} context
   * @return {Array}
   */
  menuToggle: context => {
    context.state.application.isMenuOpened = !context.state.application.isMenuOpened;
    return [states.APPLICATION];
  },

  /**
   * エンドポイント用のフィルターテキストを更新します。
   * @param {riotx.Context} context
   * @param {String} newFilterText
   * @return {Array}
   */
  endpointFilterText: (context, newFilterText) => {
    context.state.application.endpointFilterText = newFilterText;
    return [states.APPLICATION];
  }
};
