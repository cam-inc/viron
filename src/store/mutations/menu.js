import { constants as states } from '../states';

export default {
  /**
   * 開閉状態をトグルします。
   * @param {riotx.Context} context
   * @return {Array}
   */
  toggle: context => {
    context.state.menu.isOpened = !context.state.menu.isOpened;
    return [states.MENU];
  },

  /**
   * 開状態にします。
   * @param {riotx.Context} context
   * @return {Array}
   */
  open: context => {
    context.state.menu.isOpened = true;
    return [states.MENU];
  },

  /**
   * 閉状態にします。
   * @param {riotx.Context} context
   * @return {Array}
   */
  close: context => {
    context.state.menu.isOpened = false;
    return [states.MENU];
  },

  /**
   * 有効状態にします。
   * @param {riotx.Context} context
   * @return {Array}
   */
  enable: context => {
    context.state.menu.isEnabled = true;
    return [states.MENU];
  },

  /**
   * 無効状態にします。
   * @param {riotx.Context} context
   * @return {Array}
   */
  disable: context => {
    context.state.menu.isEnabled = false;
    return [states.MENU];
  }
};
