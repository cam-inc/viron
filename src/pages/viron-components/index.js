import forEach from 'mout/array/forEach';
import size from 'mout/object/size';
import './search/index.tag';

export default function() {
  const store = this.riotx.get();

  this.name = store.getter('page.name');
  this.components = store.getter('page.components');
  this.layoutType = store.getter('layout.type');
  this.isDesktop = store.getter('layout.isDesktop');
  this.parameterObjectsForCrossSearch = store.getter('components.parameterObjectsForCrossSearch');
  this.isCrossSearchEnabled = (!!this.parameterObjectsForCrossSearch.length && this.components.length >= 2);
  this.crossSearchQueries = {};
  this.hasCrossSearchQueries = false;
  this.listen('page', () => {
    this.name = store.getter('page.name');
    this.components = store.getter('page.components');
    // ページが変わったタイミングでリセットする。
    this.crossSearchQueries = {};
    this.hasCrossSearchQueries = false;
    this.update();
  });
  this.listen('layout', () => {
    this.layoutType = store.getter('layout.type');
    this.isDesktop = store.getter('layout.isDesktop');
    this.update();
  });
  this.listen('components', () => {
    this.parameterObjectsForCrossSearch = store.getter('components.parameterObjectsForCrossSearch');
    this.isCrossSearchEnabled = (!!this.parameterObjectsForCrossSearch.length && this.components.length >= 2);
    this.update();
  });

  /**
   * GET /vironに定義された情報を元に、対象となるクエリを横断検索クエリから抽出します。
   * @param {Object} def
   * @return {Object}
   */
  this.getCrossSearchQueriesByDef = def => {
    const ret = {};
    forEach(def.query, query => {
      ret[query.key] = this.crossSearchQueries[query.key];
    });
    return ret;
  };

  this.handleRefreshTap = () => {
    store.action('util.refreshAllComponents');
  };

  this.handleCrossSearchTap = () => {
    store.action('drawers.add', 'viron-components-page-search', {
      parameterObjects: this.parameterObjectsForCrossSearch,
      initialVal: this.crossSearchQueries,
      onSearch: newSearchQueries => {
        this.crossSearchQueries = newSearchQueries;
        this.hasCrossSearchQueries = !!size(newSearchQueries);
        this.update();
      }
    }, { isNarrow: true });
  };
}
