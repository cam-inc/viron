import isArray from 'mout/lang/isArray';
import isObject from 'mout/lang/isObject';
import '../../operation/index.tag';
import '../../search/index.tag';
import './operations/index.tag';

export default function() {
  const store = this.riotx.get();

  /**
   * OASに従いGETリクエストを送信します。
   * @return {Promise}
   */
  const getData = () => {
    return Promise
      .resolve()
      .then(() => {
        this.isLoading = true;
        this.update();
      })
      .then(() => store.action('components.get', this.opts.id, this.opts.def))
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
      return 'TODO: エラーメッセージ';
    }
    if (!isObject(data[0])) {
      return 'TODO: エラーメッセージ';
    }
    return null;
  };

  /**
   * 入力フォームを開きます。
   * @param {Object} operationObject
   */
  const openOperationDrawer = operationObject => {
    store.action('drawers.add', 'viron-components-page-operation', {
      operationObject,
      onSuccess: () => {
        getData();
      }
    });
  };

  // 通信レスポンス内容。
  this.data = null;
  // テーブルカラム定義。
  this.columns = [];
  // テーブルに対するoperation群。
  this.tableOperations = [];
  // テーブル行に対するoperation群。
  this.rowOperations = [];
  // 行追加operation。
  this.postOperation = null;
  // 検索用パラメータ群。
  this.searchParameters = [];
  // 通信中か否か。
  this.isLoading = true;
  // エラーメッセージ。
  this.error = null;

  this.listen(this.opts.id, () => {
    this.data = store.getter('components.response', this.opts.id);
    this.columns = store.getter('components.columns', this.opts.id);
    this.tableOperations = store.getter('components.operations', this.opts.id, 'table');
    this.rowOperations = store.getter('components.operations', this.opts.id, 'row');
    this.postOperation = store.getter('components.postOperation', this.opts.id, 'table');
    this.searchParameters = store.getter('components.searchParameters', this.opts.id);
    this.error = validate(this.data);
    this.update();
  });

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
      parameterObjects: this.searchParameters
    });
  };

  this.handleFilterButtonTap = () => {
    // TODO
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
    const rect = e.currentTarget.getBoundingClientRect();
    store.action('popovers.add', 'viron-components-page-table-operations', {
      operations: this.rowOperations
    }, {
      x: rect.left + (rect.width / 2),
      y: rect.bottom,
      width: 240,
      direction: 'TR'
    });
  };
}
