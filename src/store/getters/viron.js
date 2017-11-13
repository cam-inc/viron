import find from 'mout/array/find';
import forEach from 'mout/array/forEach';
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
    if (!context.state.viron) {
      return null;
    }
    return context.state.viron;
  },

  /**
   * VIRONデータが存在する否か。
   * @param {riotx.Context} context
   * @return {Boolean}
   */
  existence: context => {
    return !!context.state.viron;
  },

  /**
   * page群を返します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  pages: context => {
    return context.state.viron.pages;
  },

  /**
   * 指定idx値のpageのidを返します。
   * @param {riotx.Context} context
   * @param {Number} idx
   * @return {String}
   */
  pageIdOf: (context, idx) => {
    return context.state.viron.pages[idx].id;
  },

  /**
   * 名前を返します。
   * @param {riotx.Context} context
   * @return {String}
   */
  name: context => {
    return context.state.viron.name;
  },

  /**
   * ダッシュボードメニュー群を返します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  dashboard: context => {
    if (!context.state.viron) {
      return [];
    }
    return values(filter(context.state.viron.pages, page => {
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
    if (!context.state.viron) {
      return [];
    }
    return values(filter(context.state.viron.pages, page => {
      if (page.section !== SECTION_MANAGE) {
        return false;
      }
      return true;
    }));
  },

  /**
   * メニュー内容を返します。
   * @param {riot.Context} context
   * @return {Array}
   */
  menu: context => {
    const menu = [];
    if (!context.state.viron || !context.state.viron.sections) {
      return menu;
    }
    const sections = context.state.viron.sections;
    forEach(sections, section => {
      menu.push({
        name: section.label || section.id,
        id: section.id,
        groups: []
      });
    });
    const pages = context.state.viron.pages;
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
};
