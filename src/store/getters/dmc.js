import filter from 'mout/object/filter';
import values from 'mout/object/values';

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
    return context.state.dmc.getRawValue();
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
    const rawData = context.state.dmc.getRawValue();
    return rawData.pages;
  },

  /**
   * 指定idx値のpageのidを返します。
   * @param {riotx.Context} context
   * @param {Number} idx
   * @return {String}
   */
  pageIdOf: (context, idx) => {
    const rawData = context.state.dmc.getRawValue();
    const page = rawData.pages[idx];
    return page.id;
  },

  /**
   * 名前を返します。
   * @param {riotx.Context} context
   * @return {String}
   */
  name: context => {
    const rawData = context.state.dmc.getRawValue();
    return rawData.name;
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
    const rawData = context.state.dmc.getRawValue();
    const pages = rawData.pages;
    return values(filter(pages, v => {
      if (v.section !== 'dashboard') {
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
    const rawData = context.state.dmc.getRawValue();
    const pages = rawData.pages;
    return values(filter(pages, v => {
      if (v.section !== 'manage') {
        return false;
      }
      return true;
    }));
  }
};
