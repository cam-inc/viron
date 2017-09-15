import contains from 'mout/array/contains';
import forEach from 'mout/array/forEach';
import reject from 'mout/array/reject';
import throttle from 'mout/function/throttle';
import isUndefined from 'mout/lang/isUndefined';
import keys from 'mout/object/keys';
import objectReject from 'mout/object/reject';
import ObjectAssign from 'object-assign';
import chart from '../../../core/chart';
import { constants as actions } from '../../../store/actions';
import { constants as getters } from '../../../store/getters';
import { constants as states } from '../../../store/states';
import '../../organisms/viron-component/search.tag';
import '../../atoms/viron-message/index.tag';

export default function() {
  const store = this.riotx.get();

  this.name = store.getter(getters.PAGE_NAME);
  this.tableComponents = store.getter(getters.PAGE_COMPONENTS_TABLE);
  this.notTableComponents = store.getter(getters.PAGE_COMPONENTS_NOT_TABLE);
  this.componentsCount = store.getter(getters.PAGE_COMPONENTS_COUNT);
  // リクエストパラメータ定義。
  this.parameterObjects = [];
  // tooltip表示中か否か。
  this.isSearchTooltipVisible = false;
  // 現在の検索用リクエストパラメータ値。
  this.currentSearchRequestParameters = {};
  this.isCurrentSearchRequestParametersEmpty = () => {
    return !keys(this.currentSearchRequestParameters).length;
  };
  // 検索用のParameterObject群を返します。(i.e. ページング用のParameterObjectを取り除く)
  this.getParameterObjectsForSearch = () => {
    const ret = reject(this.parameterObjects || [], parameterObject => {
      if (parameterObject.in !== 'query') {
        return false;
      }
      if (parameterObject.name === 'limit') {
        return true;
      }
      if (parameterObject.name === 'offset') {
        return true;
      }
      return false;
    });
    return ret;
  };
  // componentで定義されている値のみ抽出します。
  this.getCurrentSearchRequestParametersForComponent = component => {
    const parameterObjects = store.getter(getters.OAS_PARAMETER_OBJECTS, component.api.path, component.api.method);
    const names = [];
    forEach(parameterObjects, parameterObject => {
      names.push(parameterObject.name);
    });
    return objectReject(this.currentSearchRequestParameters, (v, k) => {
      return !contains(names, k);
    });
  };
  // 現在の検索用パラメータ値をリセットします。
  this.currentSearchRequestParametersResetter = () => {
    this.currentSearchRequestParameters = {};
    this.update();
  };

  /**
   * 現在のviewportに最適なcolumn数を計算して返します。
   * @return {Number}
   */
  const getGridColumnCountForCurrentViewport = () => {
    // table表示以外のコンポーネント数が0の場合はrefs.listが存在しない。適当な固定値を返却する。
    if (!this.refs.list) {
      return 1;
    }

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
  }).on('updated', () => {
    this.rebindTouchEvents();
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
    this.tableComponents = store.getter(getters.PAGE_COMPONENTS_TABLE);
    this.notTableComponents = store.getter(getters.PAGE_COMPONENTS_NOT_TABLE);
    this.componentsCount = store.getter(getters.PAGE_COMPONENTS_COUNT);
    this.update();
    updateGridColumnCount();
  });

  this.listen(states.COMPONENTS, () => {
    this.parameterObjects = store.getter(getters.COMPONENTS_PARAMETER_OBJECTS);
    this.update();
  });

  this.handleSearchButtonMouseOver = () => {
    this.isSearchTooltipVisible = true;
  };

  this.handleSearchButtonMouseOut = () => {
    this.isSearchTooltipVisible = false;
  };

  this.handleSearchButtonTap = () => {
    // ページングに使用するparamerは取り除く。
    const escapedParameterObjects = this.getParameterObjectsForSearch();

    // 検索用のparameterObjectが存在しない場合は何もしない。
    if (!escapedParameterObjects.length) {
      return;
    }

    Promise
      .resolve()
      .then(() => store.action(actions.MODALS_ADD, 'viron-component-search', {
        parameterObjects: escapedParameterObjects,
        initialParameters: ObjectAssign({}, this.currentSearchRequestParameters),
        onComplete: parameters => {
          this.currentSearchRequestParameters = objectReject(ObjectAssign(this.currentSearchRequestParameters, parameters), val => {
            return isUndefined(val);
          });
          this.update();
          // 親コンポーネントから子コンポーネントを操作するのはNGだけど、ここだけ....
          // 改修するなら、search状態をstore管理する必要があるので。
          forEach(this.tags['viron-component'] || [], componentTag => {
            componentTag.updater();
          });
        }
      }))
      .catch(err => store.action(actions.MODALS_ADD, 'viron-message', {
        error: err
      }));
  };
}
