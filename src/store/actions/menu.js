import { constants as mutations } from '../mutations';

export default {
  /**
   * 開閉状態をトグルします。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  toggle: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(mutations.MENU_TOGGLE);
      });
  },

  /**
   * 開状態にします。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  open: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(mutations.MENU_OPEN);
      });
  },

  /**
   * 閉状態にします。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  close: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(mutations.MENU_CLOSE);
      });
  },

  /**
   * 有効状態にします。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  enable: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(mutations.MENU_ENABLE);
      });
  },

  /**
   * 無効状態にします。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  disable: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(mutations.MENU_DISABLE);
      });
  }
};
