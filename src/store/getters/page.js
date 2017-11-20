import contains from 'mout/array/contains';
import filter from 'mout/array/filter';
import reject from 'mout/array/reject';
import exporter from './exporter';

export default exporter('page', {
  /**
   * 全情報を返します。
   * @param {Object} state
   * @return {Object}
   */
  all: state => {
    return state.page || {};
  },

  /**
   * ページIDを返します。
   * @param {Object} state
   * @return {String}
   */
  id: state => {
    const page = state.page;
    if (!page) {
      return '';
    }
    return page.id;
  },

  /**
   * ページ名を返します。
   * @param {Object} state
   * @return {String}
   */
  name: state => {
    const page = state.page;
    if (!page) {
      return '';
    }
    return page.name;
  },

  /**
   * コンポーネント群を返します。
   * @param {Object} state
   * @return {Array}
   */
  components: state => {
    const page = state.page;
    if (!page) {
      return [];
    }
    return page.components;
  },

  /**
   * number等小型表示可能なコンポーネント群を返します。
   * @param {Object} state
   * @return {Array}
   */
  componentsInline: state => {
    const page = state.page;
    if (!page) {
      return [];
    }
    return filter(page.components, component => {
      return contains(['number'], component.style);
    });
  },

  /**
   * table表示のコンポーネント群を返します。
   * @param {Object} state
   * @return {Array}
   */
  componentsTable: state => {
    const page = state.page;
    if (!page) {
      return [];
    }
    return filter(page.components, component => {
      return contains(['table'], component.style);
    });
  },

  /**
   * table表示以外のコンポーネント群を返します。
   * @param {Object} state
   * @return {Array}
   */
  componentsNotTable: state => {
    const page = state.page;
    if (!page) {
      return [];
    }
    return reject(page.components, component => {
      return (component.style === 'table');
    });
  },

  /**
   * コンポーネント数を返します。
   * @param {Object} state
   * @return {Number}
   */
  componentsCount: state => {
    const page = state.page;
    if (!page) {
      return 0;
    }
    return (page.components || []).length;
  }
});
