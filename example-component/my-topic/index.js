import ObjectAssign from 'object-assign';

export default function() {
  const store = this.riotx.get();

  this.error = null;
  this.topics = [];
  this.postOperation = null;
  this.putOperation = null;
  this.deleteOperation = null;
  this.primary = null;
  this.hasPagination = false;
  this.pagination = null;
  this.paginationSize = store.getter('layout.isDesktop') ? 5 : 3;

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
    const queries = ObjectAssign({}, pagination);
    return Promise
      .resolve()
      .then(() => store.action('components.get', this.opts.id, this.opts.def, queries))
      .then(() => {
        this.error = null;
        this.update();
      })
      .catch(err => {
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

  this.listen(this.opts.id, () => {
    this.topics = store.getter('components.response', this.opts.id);
    this.postOperation = store.getter('components.postOperation', this.opts.id);
    this.putOperation = store.getter('components.putOperation', this.opts.id, 'item');
    this.deleteOperation = store.getter('components.deleteOperation', this.opts.id, 'item');
    this.primary = store.getter('components.primary', this.opts.id);
    this.hasPagination = store.getter('components.hasPagination', this.opts.id);
    this.pagination = store.getter('components.pagination', this.opts.id);
    this.update();
  });
  this.listen('layout', () => {
    this.paginationSize = store.getter('layout.isDesktop') ? 5 : 3;
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

  this.handlePutButtonTap = e => {
    const data = e.item.topic;
    openOperationDrawer(this.putOperation, {
      id: data.id,
      payload: {
        content: data.content
      }
    });
  };

  this.handleDeleteButtonTap = e => {
    const data = e.item.topic;
    openOperationDrawer(this.deleteOperation, {
      id: data.id
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
