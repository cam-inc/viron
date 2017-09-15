import filter from 'mout/array/filter';
import reject from 'mout/array/reject';

export default {
  /**
   * 全情報を返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  all: context => {
    return context.state.page || {};
  },

  /**
   * ページIDを返します。
   * @param {riotx.Context} context
   * @return {String}
   */
  id: context => {
    const page = context.state.page;
    if (!page) {
      return '';
    }
    return page.id;
  },

  /**
   * ページ名を返します。
   * @param {riotx.Context} context
   * @return {String}
   */
  name: context => {
    const page = context.state.page;
    if (!page) {
      return '';
    }
    return page.name;
  },

  /**
   * コンポーネント群を返します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  components: context => {
    const page = context.state.page;
    if (!page) {
      return [];
    }
    return page.components;
  },

  /**
   * table表示のコンポーネント群を返します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  componentsTable: context => {
    const page = context.state.page;
    if (!page) {
      return [];
    }
    return filter(page.components, component => {
      return (component.style === 'table');
    });
  },

  /**
   * table表示以外のコンポーネント群を返します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  componentsNotTable: context => {
    const page = context.state.page;
    if (!page) {
      return [];
    }
    return reject(page.components, component => {
      return (component.style === 'table');
    });
  },

  /**
   * コンポーネント数を返します。
   * @param {riotx.Context} context
   * @return {Number}
   */
  componentsCount: context => {
    const page = context.state.page;
    if (!page) {
      return 0;
    }
    return (page.components || []).length;
  }
};
