import constants from '../../core/constants';
import exporter from './exporter';

export default exporter('layout', {
  // レイアウトタイプ。mobile or desktop。
  type: (() => {
    const width = window.innerWidth;
    if (width > constants.layoutThreshold) {
      return constants.layoutTypeDesktop;
    }
    return constants.layoutTypeMobile;
  })(),
  // 表示サイズ。
  size: {
    width: window.innerWidth,
    height: window.innerHeight
  },
  // componentリストのgridレイアウトのcolumn数。
  componentsGridColumnCount: (() => {
    const htmlStyles = window.getComputedStyle(document.querySelector('html'));
    const columnCount = Number(htmlStyles.getPropertyValue('--page-components-grid-column-count'));
    return columnCount;
  })()
});
