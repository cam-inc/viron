import '../../../components/viron-error/index.tag';
import './menu/index.tag';
import './signin/index.tag';

export default function() {
  const store = this.riotx.get();

  // 自身がドラッグされているか否か。
  this.isSelfDragged = false;
  // ドロップ待受中か否か。
  this.isDragging = store.getter('application.isDragging');
  // ドロップ可能な状態か否か。
  this.isPrevDroppable = false;
  this.isNextDroppable = false;

  this.listen('application', () => {
    // endpointフィルター時エラーを抑制するため。
    // unmount後にapplicationのchangeイベントを受け取ってしまうのがそもそもの原因。
    if (!this.isMounted) {
      return;
    }
    this.isDragging = store.getter('application.isDragging');
    this.update();
  });

  this.handleDragStart = e => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.opts.endpoint.key);
    store.action('application.startDrag');
    this.isSelfDragged = true;
    this.update();
  };

  this.handleDrag = () => {
    // 特に何もしない。
  };

  this.handleDragEnd = () => {
    store.action('application.endDrag');
    this.isSelfDragged = false;
    this.update();
  };

  // ドラッグしている要素がドロップ領域に入った時の処理。
  this.handlePrevDragEnter = e => {
    e.preventDefault();
    this.isPrevDroppable = true;
    this.update();
  };

  // ドラッグしている要素がドロップ領域に入った時の処理。
  this.handleNextDragEnter = e => {
    e.preventDefault();
    this.isNextDroppable = true;
    this.update();
  };

  // ドラッグしている要素がドロップ領域にある間の処理。
  this.handlePrevDragOver = e => {
    e.preventDefault();
  };

  // ドラッグしている要素がドロップ領域にある間の処理。
  this.handleNextDragOver = e => {
    e.preventDefault();
  };

  // ドラッグしている要素がドロップ領域から出た時の処理。
  this.handlePrevDragLeave = () => {
    this.isPrevDroppable = false;
    this.update();
  };

  // ドラッグしている要素がドロップ領域から出た時の処理。
  this.handleNextDragLeave = () => {
    this.isNextDroppable = false;
    this.update();
  };

  const sortEndpoints = (e, newOrder) => {
    const endpointKey = e.dataTransfer.getData('text/plain');
    Promise
      .resolve()
      .then(() => store.action('endpoints.changeOrder', endpointKey, newOrder))
      .catch(err => store.action('modals.add', 'viron-error', {
        error: err
      }));
  };
  // ドラッグしている要素がドロップ領域にドロップされた時の処理。
  this.handlePrevDrop = e => {
    this.isPrevDroppable = false;
    this.update();
    sortEndpoints(e, this.opts.endpoint.order);
  };

  // ドラッグしている要素がドロップ領域にドロップされた時の処理。
  this.handleNextDrop = e => {
    this.isNextDroppable = false;
    this.update();
    sortEndpoints(e, this.opts.endpoint.order + 1);
  };

  this.handleTap = () => {
    // サインイン済みならばendpointページに遷移させる。
    // サインインしていなければ認証モーダルを表示する。
    const endpointKey = this.opts.endpoint.key;
    Promise
      .resolve()
      .then(() => store.action('auth.validate', endpointKey))
      .then(isValid => {
        if (isValid) {
          this.getRouter().navigateTo(`/${endpointKey}`);
          return Promise.resolve();
        }
        return Promise
          .resolve()
          .then(() => store.action('auth.getTypes', endpointKey))
          .then(authtypes => store.action('modals.add', 'viron-endpoints-page-endpoint-signin', {
            endpoint: this.opts.endpoint,
            authtypes
          }, { isSpread: true, width: 648 }));
      })
      .catch(err => store.action('modals.add', 'viron-error', {
        error: err
      }));
  };

  this.handleMenuTap = e => {
    e.stopPropagation();
    Promise
      .resolve()
      .then(() => {
        this.closeAllFloats();
      })
      .then(() => {
        const menuElm = this.refs.menu.root;
        const rect = menuElm.getBoundingClientRect();
        store.action('popovers.add', 'viron-endpoints-page-endpoint-menu', {
          endpoint: this.opts.endpoint
        }, {
          x: rect.left + (rect.width / 2),
          y: rect.bottom,
          width: 228,
          direction: 'TR',
          watchElm: menuElm
        });
      });
  };
}
