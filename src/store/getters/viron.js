import contains from 'mout/array/contains';
import find from 'mout/array/find';
import forEach from 'mout/array/forEach';
import filter from 'mout/object/filter';
import values from 'mout/object/values';
import exporter from './exporter';

const SECTION_DASHBOARD = 'dashboard';
const SECTION_MANAGE = 'manage';

export default exporter('viron', {
  /**
   * 全て返します。
   * @param {Object} state
   * @return {Object}
   */
  all: state => {
    if (!state.viron) {
      return null;
    }
    return state.viron;
  },

  /**
   * VIRONデータが存在する否か。
   * @param {Object} state
   * @return {Boolean}
   */
  existence: state => {
    return !!state.viron;
  },

  /**
   * page群を返します。
   * @param {Object} state
   * @return {Array}
   */
  pages: state => {
    return state.viron.pages;
  },

  /**
   * 指定idx値のpageのidを返します。
   * @param {Object} state
   * @param {Number} idx
   * @return {String}
   */
  pageIdOf: (state, idx) => {
    return state.viron.pages[idx].id;
  },

  /**
   * 名前を返します。
   * @param {Object} state
   * @return {String|null}
   */
  name: state => {
    if (!state.viron) {
      return null;
    }
    return state.viron.name;
  },

  /**
   * エンドポイントkeyを返します。
   * @param {Object} state
   * @return {String}
   */
  endpointKey: state => {
    if (!state.viron) {
      return null;
    }
    return state.viron.endpointKey;
  },

  /**
   * サムネイルを返します。
   * @param {Object} state
   * @return {String|null}
   */
  thumbnail: state => {
    if (!state.viron) {
      return null;
    }
    return state.viron.thumbnail;
  },

  /**
   * カラーを返します。
   * @param {Object} state
   * @return {String|null}
   */
  color: state => {
    if (!state.viron) {
      return null;
    }
    return state.viron.color;
  },

  /**
   * themeを返します。
   * @param {Object} state
   * @return {String}
   */
  theme: state => {
    const defaultTheme = 'standard';
    if (!state.viron) {
      return defaultTheme;
    }
    if (!contains(['standard', 'midnight', 'terminal'], state.viron.theme)) {
      return defaultTheme;
    }
    return state.viron.theme;
  },

  /**
   * ダッシュボードメニュー群を返します。
   * @param {Object} state
   * @return {Array}
   */
  dashboard: state => {
    if (!state.viron) {
      return [];
    }
    return values(filter(state.viron.pages, page => {
      if (page.section !== SECTION_DASHBOARD) {
        return false;
      }
      return true;
    }));
  },

  /**
   * 管理画面メニュー群を返します。
   * @param {Object} state
   * @return {Array}
   */
  manage: state => {
    if (!state.viron) {
      return [];
    }
    return values(filter(state.viron.pages, page => {
      if (page.section !== SECTION_MANAGE) {
        return false;
      }
      return true;
    }));
  },

  /**
   * メニュー内容を返します。
   * @param {Object} state
   * @return {Array}
   */
  menu: state => {
    const menu = [];
    if (!state.viron || !state.viron.sections) {
      return menu;
    }
    const sections = state.viron.sections;
    forEach(sections, section => {
      menu.push({
        name: section.label || section.id,
        id: section.id,
        groups: []
      });
    });
    const pages = state.viron.pages;
    forEach(pages, page => {
      const targetSection = find(menu, section => {
        return (section.id === page.section);
      });
      const groupName = page.group;
      const isIndependent = !groupName;
      if (isIndependent) {
        targetSection.groups.push({
          pages: [{
            name: page.name,
            id: page.id
          }],
          isIndependent
        });
      } else {
        if (!find(targetSection.groups, group => {
          return (group.name === groupName);
        })) {
          targetSection.groups.push({
            name: groupName,
            pages: [],
            isIndependent
          });
        }
        const targetGroup = find(targetSection.groups, group => {
          return (group.name === groupName);
        });
        targetGroup.pages.push({
          name: page.name,
          id: page.id
        });
      }
    });
    return menu;
  }
});
