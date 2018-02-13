import find from 'mout/array/find';
import ObjectAssign from 'object-assign';
import '../../components/viron-dialog/index.tag';
import '../../components/viron-error/index.tag';

export default function() {
  const store = this.riotx.get();

  /**
   * OASに従いGETリクエストを送信します。
   * @param {Object} pagination
   * @return {Promise}
   */
  const getData = pagination => {
    if (!pagination && this.hasPagination) {
      pagination = {};
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
        this.selectedItem = null;
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
      return 'レスポンスデータに誤りがあります。';
    }
    return null;
  };

  // 通信レスポンス内容。
  this.data = null;
  // item追加operation。
  this.postOperation = null;
  // item削除operation。
  this.deleteOperation = null;
  // 通信中か否か。
  this.isLoading = true;
  // エラーメッセージ。
  this.error = null;
  // ページネーションが存在するか否か。
  this.hasPagination = false;
  // ページネーション情報。
  this.pagination = null;
  // ページネーションコンポーネントのボタン数。
  this.paginationSize = store.getter('layout.isDesktop') ? 5 : 3;
  // 選択されているitem。
  this.selectedItem = null;
  // 追加itemのFileオブジェクト。
  this.file = null;
  // 自動更新間隔。
  this.autoRefreshSec = null;
  let autoRefreshIntervalId = null;
  const activateAutoRefresh = () => {
    if (!this.autoRefreshSec) {
      return;
    }
    if (autoRefreshIntervalId) {
      return;
    }
    autoRefreshIntervalId = window.setInterval(() => {
      getData();
    }, this.autoRefreshSec * 1000);
  };
  const inactivateAutoRefresh = () => {
    window.clearInterval(autoRefreshIntervalId);
    autoRefreshIntervalId = null;
  };

  this.listen('layout', () => {
    this.paginationSize = store.getter('layout.isDesktop') ? 5 : 3;
    this.update();
  });
  this.listen(this.opts.id, () => {
    this.data = store.getter('components.response', this.opts.id);
    this.postOperation = store.getter('components.postOperation', this.opts.id, 'explorer');
    this.deleteOperation = store.getter('components.deleteOperation', this.opts.id, 'explorer');
    this.error = validate(this.data);
    this.hasPagination = store.getter('components.hasPagination', this.opts.id);
    this.pagination = store.getter('components.pagination', this.opts.id);
    this.autoRefreshSec = store.getter('components.autoRefreshSec', this.opts.id);
    activateAutoRefresh();
    this.update();
  });

  this.refreshId = store.getter('util.components_refresh');
  this.listen('util', () => {
    const refreshId = store.getter('util.components_refresh');
    if (this.refreshId !== refreshId) {
      this.refreshId = refreshId;
      getData();
    }
  });

  this.on('mount', () => {
    getData();
  }).on('unmount', () => {
    inactivateAutoRefresh();
    store.action('components.remove', this.opts.id);
  });

  /**
   * @param {File} newFile
   */
  this.handleUploaderChange = newFile => {
    this.file = newFile;
    this.update();
  };

  const postImage = () => {
    if (!this.file) {
      return;
    }
    const parameterObject = find(this.postOperation.parameters, parameter => {
      return parameter.type === 'file';
    });
    if (!parameterObject) {
      return;
    }
    const key = parameterObject.name;
    const parameters = {};
    parameters[key] = this.file;
    Promise
      .resolve()
      .then(() => store.action('components.operate', this.postOperation, parameters))
      .then(() => {
        return store.action('toasts.add', {
          message: '画像を追加しました。'
        });
      })
      .then(() => {
        this.file = null;
        this.selectedItem = null;
        if (!this.hasPagination) {
          getData();
        } else {
          const pagination = {};
          const size = this.pagination.size;
          const current = 1;
          pagination.limit = size;
          pagination.offset = (current - 1) * size;
          getData(pagination);
        }
      })
      .catch(err => {
        if (err.status === 401) {
          return store.action('modals.add', 'viron-error', {
            title: '認証切れ'
          }).then(() => {
            this.getRouter().navigateTo('/');
          });
        }
        return store.action('modals.add', 'viron-error', {
          error: err
        });
      });
  };

  /**
   * @param {String} id
   */
  const deleteImage = id => {
    if (!id) {
      return;
    }
    const parameterObject = find(this.deleteOperation.parameters, parameter => {
      return parameter.in === 'path';
    });
    if (!parameterObject) {
      return;
    }
    const key = parameterObject.name;
    const parameters = {};
    parameters[key] = id;
    Promise
      .resolve()
      .then(() => store.action('components.operate', this.deleteOperation, parameters))
      .then(() => {
        return store.action('toasts.add', {
          message: '画像を削除しました。'
        });
      })
      .then(() => {
        this.selectedItem = null;
        if (!this.hasPagination) {
          getData();
        } else {
          const pagination = {};
          const size = this.pagination.size;
          const current = 1;
          pagination.limit = size;
          pagination.offset = (current - 1) * size;
          getData(pagination);
        }
      })
      .catch(err => {
        if (err.status === 401) {
          return store.action('modals.add', 'viron-error', {
            title: '認証切れ'
          }).then(() => {
            this.getRouter().navigateTo('/');
          });
        }
        return store.action('modals.add', 'viron-error', {
          error: err
        });
      });
  };

  this.handleAddButtonTap = () => {
    Promise.resolve().then(() => store.action('modals.add', 'viron-dialog', {
      title: '画像を追加する',
      message: '本当に実行しますか？',
      onPositiveSelect: () => {
        postImage();
      }
    }));
  };

  this.handleItemImageTap = e => {
    this.selectedItem = e.item.item;
    this.opts.onselect && this.opts.onselect(this.selectedItem);
    this.update();
  };

  this.handleItemDeleteTap = e => {
    const id = e.item.item.id;
    Promise.resolve().then(() => store.action('modals.add', 'viron-dialog', {
      title: '画像を削除する',
      message: '本当に実行しますか？',
      onPositiveSelect: () => {
        deleteImage(id);
      }
    }));
  };

  this.handlePaginationChange = newPage => {// eslint-disable-line no-unused-vars
    const size = this.pagination.size;
    getData({
      limit: size,
      offset: (newPage - 1) * size
    });
  };
}
