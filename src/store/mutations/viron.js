import combine from 'mout/array/combine';
import find from 'mout/array/find';
import { constants as states } from '../states';

export default {
  /**
   * @param {riotx.Context} context
   * @param {Object|null} viron
   * @return {Array}
   */
  all: (context, viron) => {
    // メニューのカテゴライズ。下位互換のため、dashboardとmanageは必須項目とする。
    if (!!viron) {
      viron.sections = viron.sections || [];
      if (!find(viron.sections, section => {
        return (section.id === 'manage');
      })) {
        viron.sections = combine([{ id: 'manage', label: '管理画面' }], viron.sections);
      }
      if (!find(viron.sections, section => {
        return (section.id === 'dashboard');
      })) {
        viron.sections = combine([{ id: 'dashboard', label: 'ダッシュボード' }], viron.sections);
      }
    }
    context.state.viron = viron;
    return [states.VIRON];
  }
};
