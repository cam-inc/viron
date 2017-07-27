import throttle from 'mout/function/throttle';
import chart from '../../../core/chart';
import { constants as getters } from '../../../store/getters';
import { constants as states } from '../../../store/states';

export default function() {
  const store = this.riotx.get();

  this.name = store.getter(getters.PAGE_NAME);
  this.components = store.getter(getters.PAGE_COMPONENTS);

  // resizeイベントハンドラーの発火回数を減らす。
  const updateGridColumnCount = throttle(() => {
    const containerWidth = this.refs.list.getBoundingClientRect().width;
    const htmlStyles = window.getComputedStyle(document.querySelector('html'));
    const currentColumnCount = Number(htmlStyles.getPropertyValue('--page-components-grid-column-count'));
    const newColumnCount = Math.floor(containerWidth / 250) || 1;
    document.documentElement.style.setProperty('--page-components-grid-column-count', newColumnCount);
    // tauchartはresize時に自動で再レンダリングするが、column数変更時にはresizeイベントが発火しないため再レンダリングが実行されない。
    // column数変更時も再レンダリングさせるために手動でresizeイベントハンドラを実行する。
    if (currentColumnCount !== newColumnCount) {
      chart.Chart.resizeOnWindowEvent();
    }
  }, 1000);

  this.on('mount', () => {
    // 初回にcolumn数を設定する。
    updateGridColumnCount();
    window.addEventListener('resize', updateGridColumnCount);
  }).on('unmount', () => {
    window.removeEventListener('resize', updateGridColumnCount);
  });

  this.listen(states.PAGE, () => {
    this.name = store.getter(getters.PAGE_NAME);
    this.components = store.getter(getters.PAGE_COMPONENTS);
    this.update();
  });
}
