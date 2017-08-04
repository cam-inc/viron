import contains from 'mout/array/contains';
import forEach from 'mout/array/forEach';
import forOwn from 'mout/object/forOwn';
import ObjectAssign from 'object-assign';
import { constants as actions } from '../../../store/actions';
import { constants as getters } from '../../../store/getters';
import { constants as states } from '../../../store/states';
import '../../atoms/dmc-message/index.tag';
import './searchbox.tag';

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
  this.alertApi = '';
  this.alertText = '';
  // レスポンスデータ。
  this.data = null;
  // レスポンスの構造。
  this.schema = null;
  // ページング情報。
  this.pagination = null;
  // 現在のページング情報。
  this.currentPaging = {};
  // 検索情報。
  this.search = null;
  // 現在のリクエストパラメータ値。
  this.currentRequestParameters = {};
  // 現在の検索条件。
  this.currentSearch = {};
  this.isCurrentSearchEmpty = () => {
    let isEmpty = true;
    forOwn(this.currentSearch, val => {
      if (!!val) {
        isEmpty = false;
      }
    });
    return isEmpty;
  };
  // 自身に関するアクション群。
  this.selfActions = null;
  // テーブル行に関するアクション群。
  this.rowActions = null;
  // テーブルのrow表示ラベル。
  this.tableLabels = null;
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
    this.alertApi = `${this.opts.component.api.method}: ${this.opts.component.api.path}`;
    this.alertText = `component type of ${this.opts.component.style} is not supported.`;
    break;
  }

  // コンポーネントを更新するための関数。
  // 子コンポーネントに渡されます。
  this.updater = (requestParameters = {}) => {
    this.isPending = true;
    this.update();

    this.currentRequestParameters = ObjectAssign(this.currentRequestParameters, requestParameters);
    return Promise
      .resolve()
      .then(() => new Promise(resolve => {
        // 通信が速すぎると見た目がチカチカするので、意図的に通信を遅らせる。
        setTimeout(() => {
          resolve();
        }, 1000);
      }))
      .then(() => store.action(actions.COMPONENTS_GET_ONE, this._riot_id, this.opts.component, this.currentRequestParameters))
      .catch(err => store.action(actions.MODALS_ADD, {
        error: err
      }));
  };

  this.validateResponse = response => {
    const style = this.opts.component.style;
    const method = this.opts.component.api.method;
    const path = this.opts.component.api.path;

    if (style === STYLE_NUMBER) {
      if (typeof response !== 'object' || response.value === 'undefined') {
        this.isValidData = false;
        this.alertApi = `${method}: ${path}`;
        this.alertText = 'unexpected response.';
        return;
      }
    }

    if (style === STYLE_TABLE) {
      if (!Array.isArray(response)) {
        this.isValidData = false;
        this.alertApi = `${method}: ${path}`;
        this.alertText = 'unexpected response.';
        return;
      }
      if (!response.length) {
        this.isValidData = false;
        this.alertApi = `${method}: ${path}`;
        this.alertText = 'Length is 0.';
        return;
      }
      if (typeof response[0] !== 'object') {
        this.isValidData = false;
        this.alertApi = `${method}: ${path}`;
        this.alertText = 'unexpected response.';
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
        this.alertApi = `${method}: ${path}`;
        this.alertText = 'unexpected response.';
        return;
      }
      if (!response.data || !response.x || !response.y || !Array.isArray(response.data)) {
        this.isValidData = false;
        this.alertApi = `${method}: ${path}`;
        this.alertText = 'unexpected response.';
        return;
      }
      if (!response.data.length) {
        this.isValidData = false;
        this.alertApi = `${method}: ${path}`;
        this.alertText = 'Length is 0.';
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
    const component = store.getter(getters.COMPONENTS_ONE, this._riot_id);
    this.data = component.data;
    if (component.pagination && component.pagination.maxPage > 1) {
      this.pagination = component.pagination;
    } else {
      this.pagination = null;
    }
    this.search = component.search;
    this.schema = store.getter(getters.COMPONENTS_ONE_SCHEMA, this._riot_id);
    this.selfActions = store.getter(getters.COMPONENTS_ONE_SELF_ACTIONS, this._riot_id);
    this.rowActions = store.getter(getters.COMPONENTS_ONE_ROW_ACTIONS, this._riot_id);
    this.tableLabels = store.getter(getters.COMPONENTS_ONE_TABLE_LABELS, this._riot_id);
    this.validateResponse(this.data);
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

    const queries = [];
    forEach(this.search, query => {
      queries.push({
        key: query.key,
        type: query.type,
        value: this.currentSearch[query.key] || ''
      });
    });
    Promise
      .resolve()
      .then(() => store.action(actions.MODALS_ADD, 'dmc-component-searchbox', {
        queries,
        onSearch: queries => {
          // キーワード変更後は1ページ目に戻す。
          this.currentPaging = {};
          this.currentSearch = queries;
          this.updater(queries);
        }
      }))
      .catch(err => store.action(actions.MODALS_ADD, 'dmc-message', {
        error: err
      }));
  };

  this.handlePaginationChange = page => {
    const paging = this.currentPaging = {
      limit: this.pagination.size,
      offset: (page - 1) * this.pagination.size
    };
    this.updater(paging);
  };
}
