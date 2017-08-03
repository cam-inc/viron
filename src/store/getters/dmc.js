import filter from 'mout/object/filter';
import values from 'mout/object/values';

const SECTION_DASHBOARD = 'dashboard';
const SECTION_MANAGE = 'manage';

export default {
  /**
   * 全て返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  all: context => {
    if (!context.state.dmc) {
      return null;
    }
    return context.state.dmc;
  },

  /**
   * DMCデータが存在する否か。
   * @param {riotx.Context} context
   * @return {Boolean}
   */
  existence: context => {
    return !!context.state.dmc;
  },

  /**
   * page群を返します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  pages: context => {
    return context.state.dmc.pages;
  },

  /**
   * 指定idx値のpageのidを返します。
   * @param {riotx.Context} context
   * @param {Number} idx
   * @return {String}
   */
  pageIdOf: (context, idx) => {
    return context.state.dmc.pages[idx].id;
  },

  /**
   * 名前を返します。
   * @param {riotx.Context} context
   * @return {String}
   */
  name: context => {
    return context.state.dmc.name;
  },

  /**
   * ダッシュボードメニュー群を返します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  dashboard: context => {
    if (!context.state.dmc) {
      return [];
    }
    return values(filter(context.state.dmc.pages, page => {
      if (page.section !== SECTION_DASHBOARD) {
        return false;
      }
      return true;
    }));
  },

  /**
   * 管理画面メニュー群を返します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  manage: context => {
    if (!context.state.dmc) {
      return [];
    }
    return values(filter(context.state.dmc.pages, page => {
      if (page.section !== SECTION_MANAGE) {
        return false;
      }
      return true;
    }));
  }
};
