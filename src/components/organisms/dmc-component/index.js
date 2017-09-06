import contains from 'mout/array/contains';
import reject from 'mout/array/reject';
import isUndefined from 'mout/lang/isUndefined';
import keys from 'mout/object/keys';
import objectReject from 'mout/object/reject';
import ObjectAssign from 'object-assign';
import { constants as actions } from '../../../store/actions';
import { constants as getters } from '../../../store/getters';
import { constants as states } from '../../../store/states';
import '../../atoms/dmc-message/index.tag';
import './search.tag';

const STYLE_NUMBER = 'number';
const STYLE_TABLE = 'table';
const STYLE_GRAPH_BAR = 'graph-bar';
const STYLE_GRAPH_SCATTERPLOT = 'graph-scatterplot';
const STYLE_GRAPH_LINE = 'graph-line';
const STYLE_GRAPH_HORIZONTAL_BAR = 'graph-horizontal-bar';
const STYLE_GRAPH_STACKED_BAR = 'graph-stacked-bar';
const STYLE_GRAPH_HORIZONTAL_STACKED_BAR = 'graph-horizontal-stacked-bar';
const STYLE_GRAPH_STACKED_AREA = 'graph-stacked-area';

export default function() {
  const store = this.riotx.get();

  // データ取得中か否か。
  this.isPending = true;
  // レスポンスデータが有効か否か。
  this.isValidData = false;
  // レスポンスデータが不正の時に表示するエラー文言。
  this.alertText = '';
  // レスポンスデータ。
  this.response = null;
  // レスポンスの構造。
  this.schemaObject = null;
  // リクエストパラメータ定義。
  this.parameterObjects = [];
  // 自身に関するアクション群。
  this.selfActions = [];
  // テーブル行に関するアクション群。
  this.rowActions = [];
  // テーブルのrow表示ラベル。
  this.tableLabels = [];
  // テーブル使用時のprimaryキー。
  this.primaryKey = null;
  // ページング機能ONかどうか。
  this.hasPagination = false;
  // ページング情報。
  this.pagination = {};
  // ページングのサイズ値。
  this.paginationSize = 3;
  // 現在の検索用リクエストパラメータ値。
  this.currentSearchRequestParameters = {};
  this.isCurrentSearchRequestParametersEmpty = () => {
    return !keys(this.currentSearchRequestParameters).length;
  };
  // 検索用のParameterObject群を返します。(i.e. ページング用のParameterObjectを取り除く)
  this.getParameterObjectsForSearch = () => {
    return reject(this.parameterObjects || [], parameterObject => {
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
  };

  // コンポーネントにrenderするRiotタグ名。
  this.childComponentName = null;
  switch (this.opts.component.style) {
  case STYLE_NUMBER:
    this.childComponentName = 'dmc-component-number';
    break;
  case STYLE_TABLE:
    this.childComponentName = 'dmc-component-table';
    break;
  case STYLE_GRAPH_BAR:
    this.childComponentName = 'dmc-component-graph-bar';
    break;
  case STYLE_GRAPH_SCATTERPLOT:
    this.childComponentName = 'dmc-component-graph-scatterplot';
    break;
  case STYLE_GRAPH_LINE:
    this.childComponentName = 'dmc-component-graph-line';
    break;
  case STYLE_GRAPH_HORIZONTAL_BAR:
    this.childComponentName = 'dmc-component-graph-horizontal-bar';
    break;
  case STYLE_GRAPH_STACKED_BAR:
    this.childComponentName = 'dmc-component-graph-stacked-bar';
    break;
  case STYLE_GRAPH_HORIZONTAL_STACKED_BAR:
    this.childComponentName = 'dmc-component-graph-horizontal-stacked-bar';
    break;
  case STYLE_GRAPH_STACKED_AREA:
    this.childComponentName = 'dmc-component-graph-stacked-area';
    break;
  default:
    this.isValidData = false;
    this.alertText = `"${this.opts.component.style}"はサポートされていないstyleです。サポートされているstyleを使用して下さい。`;
    break;
  }

  // コンポーネントを更新するための関数。
  // 子コンポーネントに渡されます。
  this.updater = (requestParameters = {}) => {
    this.isPending = true;
    this.update();

    this.currentSearchRequestParameters = objectReject(ObjectAssign(this.currentSearchRequestParameters, requestParameters), val => {
      return isUndefined(val);
    });
    return Promise
      .resolve()
      .then(() => new Promise(resolve => {
        // 通信が速すぎると見た目がチカチカするので、意図的に通信を遅らせる。
        setTimeout(() => {
          resolve();
        }, 300);
      }))
      .then(() => store.action(actions.COMPONENTS_GET_ONE, this._riot_id, this.opts.component, this.currentSearchRequestParameters))
      .catch(err => {
        const api = this.opts.component.api;
        return store.action(actions.MODALS_ADD, {
          title: '通信失敗',
          message: `[${api.method.toUpperCase()} ${api.path}]通信に失敗しました。該当するAPIがOAS上に正しく定義されているかご確認下さい。`,
          error: err
        });
      });
  };

  /**
   * レスポンス内容が正しい形式か確認します。
   * @param {*} response
   */
  this.validateResponse = response => {
    const style = this.opts.component.style;

    if (style === STYLE_NUMBER) {
      if (typeof response !== 'object' || response.value === 'undefined') {
        this.isValidData = false;
        this.alertText = 'レスポンス形式が不正です。正しいレスポンス形式に修正して下さい。';
        return;
      }
    }

    if (style === STYLE_TABLE) {
      if (!Array.isArray(response)) {
        this.isValidData = false;
        this.alertText = 'レスポンス形式が不正です。正しいレスポンス形式に修正して下さい。';
        return;
      }
      if (!response.length) {
        this.isValidData = false;
        this.alertText = 'テーブルが空です。';
        return;
      }
      if (typeof response[0] !== 'object') {
        this.isValidData = false;
        this.alertText = 'レスポンス形式が不正です。正しいレスポンス形式に修正して下さい。';
        return;
      }
    }

    if (contains([
      STYLE_GRAPH_BAR,
      STYLE_GRAPH_SCATTERPLOT,
      STYLE_GRAPH_LINE,
      STYLE_GRAPH_HORIZONTAL_BAR,
      STYLE_GRAPH_STACKED_BAR,
      STYLE_GRAPH_HORIZONTAL_STACKED_BAR,
      STYLE_GRAPH_STACKED_AREA
    ], style)) {
      if (typeof response !== 'object') {
        this.isValidData = false;
        this.alertText = 'レスポンス形式が不正です。正しいレスポンス形式に修正して下さい。';
        return;
      }
      if (!response.data || !response.x || !response.y || !Array.isArray(response.data)) {
        this.isValidData = false;
        this.alertText = 'レスポンス形式が不正です。正しいレスポンス形式に修正して下さい。';
        return;
      }
      if (!response.data.length) {
        this.isValidData = false;
        this.alertText = 'グラフデータが空です。';
        return;
      }
    }

    this.isValidData = true;
    this.alertText = '';
  };

  this.on('mount', () => {
    // TODO: GETリクエストに必須パラメータが存在するケースへの対応。
    this.updater();
  }).on('updated', () => {
    this.rebindTouchEvents();
  }).on('unmount', () => {
    store.action(actions.COMPONENTS_REMOVE_ONE, this._riot_id);
  });

  this.listen(states.COMPONENTS_ONE(this._riot_id), () => {
    this.isPending = false;
    this.response = store.getter(getters.COMPONENTS_ONE_RESPONSE, this._riot_id);
    this.schemaObject = store.getter(getters.COMPONENTS_ONE_SCHEMA_OBJECT, this._riot_id);
    this.parameterObjects = store.getter(getters.COMPONENTS_ONE_PARAMETER_OBJECTS, this._riot_id);
    this.selfActions = store.getter(getters.COMPONENTS_ONE_ACTIONS_SELF, this._riot_id);
    this.rowActions = store.getter(getters.COMPONENTS_ONE_ACTIONS_ROW, this._riot_id);
    this.hasPagination = store.getter(getters.COMPONENTS_ONE_HAS_PAGINATION, this._riot_id);
    this.pagination = store.getter(getters.COMPONENTS_ONE_PAGINATION, this._riot_id);
    this.primaryKey = store.getter(getters.COMPONENTS_ONE_PRIMARY_KEY, this._riot_id);
    this.tableLabels = store.getter(getters.COMPONENTS_ONE_TABLE_LABELS, this._riot_id);
    this.validateResponse(this.response);
    this.update();
  });

  this.handleRefreshButtonTap = () => {
    Promise
      .resolve()
      .then(() => {
        // 更新時に高さが変わらないように。
        const rect = this.refs.body.getBoundingClientRect();
        this.refs.body.style.height = `${rect.height}px`;
      })
      .then(() => this.updater())
      .then(() => {
        this.refs.body.style.height = '';
      });
  };

  this.handleSearchButtonTap = () => {
    if (this.isPending) {
      return;
    }

    // ページングに使用するparamerは取り除く。
    const escapedParameterObjects = this.getParameterObjectsForSearch();

    // 検索用のparameterObjectが存在しない場合は何もしない。
    if (!escapedParameterObjects.length) {
      return;
    }

    Promise
      .resolve()
      .then(() => store.action(actions.MODALS_ADD, 'dmc-component-search', {
        parameterObjects: this.parameterObjects,
        initialParameters: ObjectAssign({}, this.currentSearchRequestParameters),
        onComplete: parameters => {
          this.updater(parameters);
        }
      }))
      .catch(err => store.action(actions.MODALS_ADD, 'dmc-message', {
        error: err
      }));
  };

  this.handlePaginationChange = page => {
    // TODO: swagger上に定義されていないけどOK？？
    const paging = this.currentPaging = {
      limit: this.pagination.size,
      offset: (page - 1) * this.pagination.size
    };
    this.updater(paging);
  };
}
