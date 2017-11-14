import { constants as actions } from '../../store/actions';
import { constants as getters } from '../../store/getters';
import { constants as states } from '../../store/states';
import './autocomplete/index.tag';
import './menu/index.tag';

export default function() {
  const store = this.riotx.get();

  // TOPページか否か。
  this.isTopPage = store.getter(getters.LOCATION_IS_TOP);
  // メニューの開閉状態。
  this.isMenuOpened = store.getter(getters.APPLICATION_ISMENUOPENED);
  // モバイルレイアウトか否か。
  this.isMobile = store.getter(getters.LAYOUT_IS_MOBILE);
  // エンドポイント名。
  this.name = store.getter(getters.VIRON_NAME);
  // エンドポイントのサムネイル。
  this.thumbnail = store.getter(getters.VIRON_THUMBNAIL);

  this.listen(states.LOCATION, () => {
    this.isTopPage = store.getter(getters.LOCATION_IS_TOP);
    this.update();
  });
  this.listen(states.APPLICATION, () => {
    this.isMenuOpened = store.getter(getters.APPLICATION_ISMENUOPENED);
    this.update();
  });
  this.listen(states.LAYOUT, () => {
    this.isMobile = store.getter(getters.LAYOUT_IS_MOBILE);
    this.update();
  });
  this.listen(states.VIRON, () => {
    this.name = store.getter(getters.VIRON_NAME);
    this.thumbnail = store.getter(getters.VIRON_THUMBNAIL);
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
    store.action(actions.APPLICATION_MENU_TOGGLE);
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
