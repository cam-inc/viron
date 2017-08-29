export default {
  // componentリストのgridレイアウトのcolumn数。
  componentsGridColumnCount: (() => {
    const htmlStyles = window.getComputedStyle(document.querySelector('html'));
    const columnCount = Number(htmlStyles.getPropertyValue('--page-components-grid-column-count'));
    return columnCount;
  })()
};
