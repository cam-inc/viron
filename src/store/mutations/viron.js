import combine from 'mout/array/combine';
import find from 'mout/array/find';
import { i18n } from '../../core/i18n';
import exporter from './exporter';

export default exporter('viron', {
  /**
   * @param {Object} state
   * @param {Object|null} viron
   * @return {Array}
   */
  all: (state, viron) => {
    // メニューのカテゴライズ。下位互換のため、dashboardとmanageは必須項目とする。
    if (!!viron) {
      viron.sections = viron.sections || [];
      if (!find(viron.sections, section => {
        return (section.id === 'manage');
      })) {
        viron.sections = combine([{ id: 'manage', label: i18n.t('word.manage') }], viron.sections);
      }
      if (!find(viron.sections, section => {
        return (section.id === 'dashboard');
      })) {
        viron.sections = combine([{ id: 'dashboard', label: i18n.t('word.dashboard') }], viron.sections);
      }
    }
    state.viron = viron;
    return ['viron'];
  }
});
