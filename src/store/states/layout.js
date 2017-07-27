export default {
  // endpointリストのgridレイアウトのcolumn数。
  endpointsGridColumnCount: (() => {
    const htmlStyles = window.getComputedStyle(document.querySelector('html'));
    const columnCount = Number(htmlStyles.getPropertyValue('--page-endpoints-grid-column-count'));
    return columnCount;
  })(),
  // componentリストのgridレイアウトのcolumn数。
  componentsGridColumnCount: (() => {
    const htmlStyles = window.getComputedStyle(document.querySelector('html'));
    const columnCount = Number(htmlStyles.getPropertyValue('--page-components-grid-column-count'));
    return columnCount;
  })()
};
