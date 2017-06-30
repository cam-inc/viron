import reject from 'mout/array/reject';
import ObjectAssign from 'object-assign';
import { constants as states } from '../states';

export default {
  /**
   * 起動ステータスを変更します。
   * @return {Array}
   */
  launch: (context, bool) => {
    context.state.application.isLaunched = bool;
    return [states.APPLICATION];
  },

  /**
   * 画面遷移ステータスを変更します。
   * @return {Array}
   */
  navigation: (context, bool) => {
    context.state.application.isNavigating = bool;
    return [states.APPLICATION];
  },

  /**
   * 通信中APIを追加します。
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
  }
};
