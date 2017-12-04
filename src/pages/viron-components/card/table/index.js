import contains from 'mout/array/contains';
import filter from 'mout/array/filter';
import forEach from 'mout/array/forEach';
import forOwn from 'mout/object/forOwn';
import size from 'mout/object/size';
import deepClone from 'mout/lang/deepClone';
import isArray from 'mout/lang/isArray';
import isNull from 'mout/lang/isNull';
import isObject from 'mout/lang/isObject';
import isUndefined from 'mout/lang/isUndefined';
import ObjectAssign from 'object-assign';
import '../../filter/index.tag';
import '../../operation/index.tag';
import '../../search/index.tag';
import './operations/index.tag';

export default function() {
  const store = this.riotx.get();

  /**
   * OASに従いGETリクエストを送信します。
   * @param {Object} pagination
   * @return {Promise}
   */
  const getData = pagination => {
    if (!pagination && this.hasPagination) {
      const size = this.pagination.size;
      const current = this.pagination.current;
      pagination.limit = size;
      pagination.offset = (current - 1) * size;
    }
    const queries = ObjectAssign({}, this.searchQueries, pagination);
    return Promise
      .resolve()
      .then(() => {
        this.isLoading = true;
        this.update();
      })
      .then(() => Promise.all([
        // チカチカを防ぐ。
        new Promise(resolve => setTimeout(resolve, 300)),
        store.action('components.get', this.opts.id, this.opts.def, queries)
      ]))
      .then(() => {
        this.isLoading = false;
        this.update();
      })
      .catch(err => {
        this.isLoading = false;
        if (err.status === 401) {
          this.error = '認証エラー。';
        } else {
          const api = this.opts.def.api;
          this.error = `[${api.method.toUpperCase()} ${api.path}]通信に失敗しました。`;
        }
        this.update();
      });
  };

  /**
   * レスポンスデータの正当性をチェックします。
   * @param {Object} data
   * @return {String|null}
   */
  const validate = data => {
    if (!data) {
      return 'TODO: エラーメッセージ';
    }
    if (!isArray(data)) {
      return 'TODO: エラーメッセージ';
    }
    if (!data.length) {
      return '0件';
    }
    if (!isObject(data[0])) {
      return 'TODO: エラーメッセージ';
    }
    return null;
  };

  /**
   * 入力フォームを開きます。
   * @param {Object} operationObject
   * @param {Object} initialValue
   */
  const openOperationDrawer = (operationObject, initialVal) => {
    store.action('drawers.add', 'viron-components-page-operation', {
      operationObject,
      initialVal,
      primary: this.primary,
      onSuccess: () => {
        getData();
      }
    });
  };

  // 通信レスポンス内容。
  this.data = null;
  // テーブルカラム定義。
  this.columns = [];
  // 表示させるべきカラム群。filter機能でON/OFFされます。null = すべて表示。
  this.visibleColumnKeys = null;
  // テーブルに対するoperation群。
  this.tableOperations = [];
  // テーブル行に対するoperation群。
  this.rowOperations = [];
  // 行追加operation。
  this.postOperation = null;
  // 検索用パラメータ群。
  this.searchParameters = [];
  // primaryキー
  this.primary = null;
  // 通信中か否か。
  this.isLoading = true;
  // エラーメッセージ。
  this.error = null;
  // ページネーションが存在するか否か。
  this.hasPagination = false;
  // ページネーション情報。
  this.pagination = null;
  // 検索クエリ群。
  this.searchQueries = {};
  this.hasSearchQueries = false;

  this.listen(this.opts.id, () => {
    this.data = store.getter('components.response', this.opts.id);
    this.columns = store.getter('components.columns', this.opts.id);
    this.tableOperations = store.getter('components.operations', this.opts.id, 'table');
    this.rowOperations = store.getter('components.operations', this.opts.id, 'row');
    this.postOperation = store.getter('components.postOperation', this.opts.id, 'table');
    this.searchParameters = store.getter('components.searchParameters', this.opts.id);
    this.primary = store.getter('components.primary', this.opts.id);
    this.error = validate(this.data);
    this.hasPagination = store.getter('components.hasPagination', this.opts.id);
    this.pagination = store.getter('components.pagination', this.opts.id);
    this.update();
  });

  /**
   * 表示対象カラムのみを返します。
   * @return {Array}
   */
  this.getFilteredColumns = () => {
    // nullやundefined時は全てのカラムを表示する。
    if (!this.visibleColumnKeys) {
      return this.columns;
    }
    return filter(this.columns, column => {
      return contains(this.visibleColumnKeys, column.key);
    });
  };

  this.on('mount', () => {
    getData();
  }).on('unmount', () => {
    store.action('components.remove', this.opts.id);
  });

  this.handlePostButtonTap = () => {
    openOperationDrawer(this.postOperation);
  };

  this.handleSearchButtonTap = () => {
    store.action('modals.add', 'viron-components-page-search', {
      parameterObjects: this.searchParameters,
      initialVal: this.searchQueries,
      onSearch: newSearchQueries => {
        this.searchQueries = newSearchQueries;
        this.hasSearchQueries = !!size(newSearchQueries);
        getData();
      }
    });
  };

  this.handleFilterButtonTap = () => {
    store.action('modals.add', 'viron-components-page-filter', {
      columns: this.columns,
      selectedColumnKeys: this.visibleColumnKeys,
      onChange: newSelectedColumnKeys => {
        this.visibleColumnKeys = newSelectedColumnKeys;
        getData();
      }
    });
  };

  this.handleReloadButtonTap = () => {
    getData();
  };

  this.handleSettingButtonTap = () => {
    const rect = this.refs.settingIcon.root.getBoundingClientRect();
    store.action('popovers.add', 'viron-components-page-table-operations', {
      operations: this.tableOperations,
      onSelect: operationObject => {
        openOperationDrawer(operationObject);
      }
    }, {
      x: rect.left + (rect.width / 2),
      y: rect.bottom,
      width: 240,
      direction: 'TR'
    });
  };

  this.handleRowTap = () => {
    // TODO
  };

  this.handleRowSettingButtonTap = e => {
    e.stopPropagation();
    const rowData = e.item.row;
    const rect = e.currentTarget.getBoundingClientRect();
    store.action('popovers.add', 'viron-components-page-table-operations', {
      operations: this.rowOperations,
      onSelect: operationObject => {
        const initialVal = {};
        // ParameterObjectから初期値を推測します。
        // TODO: 精度up可能か?
        forEach(operationObject.parameters || [], parameterObject => {
          const name = parameterObject.name;
          const _in = parameterObject.in;
          if (_in === 'body') {
            initialVal[name] = {};
            forOwn(parameterObject.schema.properties || {}, (val, key) => {
              // undefinedとnullを省く。
              if (!isUndefined(rowData[key]) && !isNull(rowData[key])) {
                initialVal[name][key] = rowData[key];
              }
            });
          } else {
            // undefinedとnullを省く。
            if (!isUndefined(rowData[name]) && !isNull(rowData[name])) {
              initialVal[name] = rowData[name];
            }
          }
        });
        openOperationDrawer(operationObject, deepClone(initialVal));
      }
    }, {
      x: rect.left + (rect.width / 2),
      y: rect.bottom,
      width: 240,
      direction: 'TR'
    });
  };

  this.handlePaginationChange = newPage => {// eslint-disable-line no-unused-vars
    const size = this.pagination.size;
    getData({
      limit: size,
      offset: (newPage - 1) * size
    });
  };
}
