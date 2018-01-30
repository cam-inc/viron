import '../menu/index.tag';
import './info/index.tag';
import './menu/index.tag';

export default function() {
  const store = this.riotx.get();

  // TOPページか否か。
  this.isTopPage = store.getter('location.isTop');
  // メニューの開閉状態。
  this.isMenuOpened = store.getter('application.isMenuOpened');
  // デスクトップレイアウトか否か。
  this.isDesktop = store.getter('layout.isDesktop');
  // モバイルレイアウトか否か。
  this.isMobile = store.getter('layout.isMobile');
  // エンドポイント名。
  this.name = store.getter('viron.name');
  // エンドポイントのサムネイル。
  this.thumbnail = store.getter('viron.thumbnail');
  // エンドポイントのカラー。
  this.color = store.getter('viron.color');

  this.listen('location', () => {
    this.isTopPage = store.getter('location.isTop');
    this.update();
  });
  this.listen('application', () => {
    this.isMenuOpened = store.getter('application.isMenuOpened');
    this.update();
  });
  this.listen('layout', () => {
    this.isDesktop = store.getter('layout.isDesktop');
    this.isMobile = store.getter('layout.isMobile');
    this.update();
  });
  this.listen('viron', () => {
    this.name = store.getter('viron.name');
    this.thumbnail = store.getter('viron.thumbnail');
    this.color = store.getter('viron.color');
    this.update();
  });

  this.handleMenuToggleButtonTap = () => {
    if (!this.isMobile) {
      store.action('application.toggleMenu');
      return;
    }
    store.action('modals.add', 'viron-application-menu', null, {
      isSpread: true,
      class: 'Application_Menu_Modal'
    });
  };

  this.handleInfoTap = () => {
    // エンドポイント情報を吹き出し表示します。
    const rect = this.refs.thumbnail.getBoundingClientRect();
    store.action('popovers.add', 'viron-application-header-info', null, {
      x: rect.left + (rect.width / 2),
      y: rect.bottom,
      width: 312,
      direction: 'TR'
    });
  };

  this.handleDotsIconTap = () => {
    const rect = this.refs.dotsIcon.root.getBoundingClientRect();
    store.action('popovers.add', 'viron-application-header-menu', null, {
      x: rect.left + (rect.width / 2),
      y: rect.bottom,
      width: 228,
      direction: 'TR'
    });
  };
}
