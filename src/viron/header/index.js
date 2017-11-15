import { constants as actions } from '../../store/actions';
import '../menu/index.tag';
import './autocomplete/index.tag';
import './menu/index.tag';

export default function() {
  const store = this.riotx.get();

  // TOPページか否か。
  this.isTopPage = store.getter('location.isTop');
  // メニューの開閉状態。
  this.isMenuOpened = store.getter('application.isMenuOpened');
  // モバイルレイアウトか否か。
  this.isMobile = store.getter('layout.isMobile');
  // エンドポイント名。
  this.name = store.getter('viron.name');
  // エンドポイントのサムネイル。
  this.thumbnail = store.getter('viron.thumbnail');

  this.listen('location', () => {
    this.isTopPage = store.getter('location.isTop');
    this.update();
  });
  this.listen('application', () => {
    this.isMenuOpened = store.getter('application.isMenuOpened');
    this.update();
  });
  this.listen('layout', () => {
    this.isMobile = store.getter('layout.isMobile');
    this.update();
  });
  this.listen('viron', () => {
    this.name = store.getter('viron.name');
    this.thumbnail = store.getter('viron.thumbnail');
    this.update();
  });

  this.handleSearchIconTap = () => {
    // 検索用オートコンプリートをpopoverで開きます。
    const rect = this.refs.searchIcon.root.getBoundingClientRect();
    store.action(actions.POPOVERS_ADD, 'viron-application-header-autocomplete', null, {
      x: rect.left + (rect.width / 2),
      y: rect.bottom,
      direction: 'TL'
    });
  };

  this.handleMenuToggleButtonTap = () => {
    if (!this.isMobile) {
      store.action(actions.APPLICATION_MENU_TOGGLE);
      return;
    }
    store.action(actions.MODALS_ADD, 'viron-application-menu', null, {
      isSpread: true
    });
  };

  this.handleSquareIconTap = () => {
    // menu(エンドポイント関連のやつ)をpopoverで開きます。
    const rect = this.refs.squareIcon.root.getBoundingClientRect();
    store.action(actions.POPOVERS_ADD, 'viron-application-header-menu', {
      type: 'endpoint'
    }, {
      x: rect.left + (rect.width / 2),
      y: rect.bottom,
      width: 228,
      direction: 'TR'
    });
  };

  this.handleDotsIconTap = () => {
    // menu(一般的なやつ)をpopoverで開きます。
    const rect = this.refs.dotsIcon.root.getBoundingClientRect();
    store.action(actions.POPOVERS_ADD, 'viron-application-header-menu', {
      type: 'general'
    }, {
      x: rect.left + (rect.width / 2),
      y: rect.bottom,
      width: 228,
      direction: 'TR'
    });
  };
}
