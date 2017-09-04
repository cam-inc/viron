import throttle from 'mout/function/throttle';
import chart from '../../../core/chart';
import { constants as actions } from '../../../store/actions';
import { constants as getters } from '../../../store/getters';
import { constants as states } from '../../../store/states';

export default function() {
  const store = this.riotx.get();

  this.name = store.getter(getters.PAGE_NAME);
  this.components = store.getter(getters.PAGE_COMPONENTS);
  this.componentsCount = store.getter(getters.PAGE_COMPONENTS_COUNT);

  /**
   * 現在のviewportに最適なcolumn数を計算して返します。
   * @return {Number}
   */
  const getGridColumnCountForCurrentViewport = () => {
    const containerWidth = this.refs.list.getBoundingClientRect().width;
    const baseColumnWith = 400;
    let newColumnCount = Math.floor(containerWidth / baseColumnWith) || 1;
    // component数が少ない時はギリギリまで横幅を使う。
    if (this.componentsCount < newColumnCount) {
      newColumnCount = this.componentsCount;
    }
    return newColumnCount;
  };

  /**
   * column数を更新します。
   */
  const updateGridColumnCount = () => {
    const columnCount = getGridColumnCountForCurrentViewport();
    store.action(actions.LAYOUT_UPDATE_COMPONENTS_GRID_COLUMN_COUNT, columnCount);
  };

  // resizeイベントハンドラーの発火回数を減らす。
  const handleResize = throttle(updateGridColumnCount, 1000);
  this.on('mount', () => {
    // 初回にcolumn数を設定する。
    updateGridColumnCount();
    window.addEventListener('resize', handleResize);
  }).on('unmount', () => {
    window.removeEventListener('resize', handleResize);
  });

  this.listen(states.LAYOUT, () => {
    const columnCount = store.getter(getters.LAYOUT_COMPONENTS_GRID_COLUMN_COUNT);
    document.documentElement.style.setProperty('--page-components-grid-column-count', columnCount);
    // tauchartはresize時に自動で再レンダリングするが、column数変更時にはresizeイベントが発火しないため再レンダリングが実行されない。
    // column数変更時も再レンダリングさせるために手動でresizeイベントハンドラを実行する。
    chart.Chart.resizeOnWindowEvent();
  });
  this.listen(states.PAGE, () => {
    this.name = store.getter(getters.PAGE_NAME);
    this.components = store.getter(getters.PAGE_COMPONENTS);
    this.componentsCount = store.getter(getters.PAGE_COMPONENTS_COUNT);
    this.update();
    updateGridColumnCount();
  });
}
