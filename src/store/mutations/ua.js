import { constants as states } from '../states';

export default {
  /**
   * UA情報を書き換えます。
   * @param {riotx.Context} context
   * @param {Object} ua
   * @return {Array}
   */
  all: (context, ua) => {
    context.state.ua = ua;
    return [states.UA];
  }
};
