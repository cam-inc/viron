import find from 'mout/array/find';
import throttle from 'mout/function/throttle';
import ObjectAssign from 'object-assign';
import '../../components/viron-dialog/index.tag';
import '../../components/viron-error/index.tag';
import './detail/index.tag';

export default function() {
  const store = this.riotx.get();

  /**
   * GridLayoutを調整します。
   */
  const _adjustGridLayout = () => {
    // column数調整。
    const listElm = this.refs.list;
    if (!!listElm) {
      const rect = listElm.getBoundingClientRect();
      const columnMinCount = (Math.floor(rect.width / 100)) || 1;
      document.documentElement.style.setProperty('--component-explorer-column-min-count', columnMinCount);
    }
  };
  const adjustGridLayout = () => {
    setTimeout(() => {
      _adjustGridLayout();
    }, 100);
  };

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
      .then(() => {
        adjustGridLayout();
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

  this.inputId = `Explorer__input${this._riot_id}`;
  this.isDragWatching = false;
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
  this.isMobile = store.getter('layout.isMobile');

  this.listen('layout', () => {
    this.paginationSize = store.getter('layout.isDesktop') ? 5 : 3;
    this.isMobile = store.getter('layout.isMobile');
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

  // resize時にvironアプリケーションの表示サイズを更新します。
  // resizeイベントハンドラーの発火回数を減らす。
  const handleResize = throttle(() => {
    adjustGridLayout();
  }, 1000);
  this.on('mount', () => {
    getData();
    window.addEventListener('resize', handleResize);
  }).on('unmount', () => {
    inactivateAutoRefresh();
    store.action('components.remove', this.opts.id);
    window.addEventListener('resize', handleResize);
  });

  /**
   * fileが変更された時の処理。
   * DnD経由でも実行されます。
   * @param {Object} e
   * @param {Boolean} fromDnD Dnd経由か否か。
   */
  this.handleFileChange = (e, fromDnD) => {
    let files;
    if (fromDnD) {
      files = e.dataTransfer.files;
    } else {
      files = e.target.files;
    }
    if (!files.length) {
      this.refs.form.reset();
      return;
    }

    const file = files[0];
    if (file.type.indexOf('image/') !== 0) {
      return;
    }
    postImage(file);
  };

  const postImage = file => {
    const parameterObject = find(this.postOperation.parameters, parameter => {
      return parameter.type === 'file';
    });
    if (!parameterObject) {
      return;
    }
    const key = parameterObject.name;
    const parameters = {};
    parameters[key] = file;
    Promise
      .resolve()
      .then(() => store.action('components.operate', this.postOperation, parameters))
      .then(() => {
        this.refs.form.reset();
      })
      .then(() => {
        return store.action('toasts.add', {
          message: '画像を追加しました。'
        });
      })
      .then(() => {
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

  this.handleDropareaTap = () => {
    this.refs.label.click();
  };

  this.handleHandlerDragEnter = e => {
    e.preventDefault();
    this.isDragWatching = true;
    this.update();
  };

  this.handleHandlerDragOver = e => {
    e.preventDefault();
  };

  this.handleHandlerDragLeave = () => {
    this.isDragWatching = false;
    this.update();
  };

  this.handleHandlerDrop = e => {
    e.preventDefault();
    this.isDragWatching = false;
    this.update();
    this.handleFileChange(e, true);
  };

  this.handleLabelTap = e => {
    e.stopPropagation();
  };

  this.handleItemTap = e => {
    store.action('drawers.add', 'viron-explorer-detail', {
      initialSelectedId: e.item.item.id,
      list: this.data,
      isDeletable: !!this.deleteOperation,
      onDelete: (id, closer) => {
        Promise.resolve().then(() => store.action('modals.add', 'viron-dialog', {
          title: '画像を完全に削除しますか？',
          message: '画像を削除した後は元に戻す事ができません。この画像を完全に削除してもよろしいですか？',
          onPositiveSelect: () => {
            closer();
            deleteImage(id);
          }
        }));
      },
      isInsertable: !!this.opts.oninsert,
      onInsert: id => {
        this.opts.oninsert && this.opts.oninsert(find(this.data, item => {
          return (item.id === id);
        }));
        this.close();
      }
    }, { isNarrow: true });
  };

  this.handlePaginationChange = newPage => {// eslint-disable-line no-unused-vars
    this.selectedItem = null;
    const size = this.pagination.size;
    getData({
      limit: size,
      offset: (newPage - 1) * size
    });
  };
}
