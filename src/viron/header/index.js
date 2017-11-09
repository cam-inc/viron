import { constants as actions } from '../../store/actions';
import './autocomplete/index.tag';
import './menu/index.tag';

export default function() {
  const store = this.riotx.get();

  this.handleSearchIconTap = () => {
    // 検索用オートコンプリートをpopoverで開きます。
    const rect = this.refs.searchIcon.getBoundingClientRect();
    store.action(actions.POPOVERS_ADD, 'viron-application-header-autocomplete', null, {
      x: rect.left + (rect.width / 2),
      y: rect.bottom,
      direction: 'TL'
    });
  };

  this.handleSquareIconTap = () => {
    // menu(エンドポイント関連のやつ)をpopoverで開きます。
    const rect = this.refs.squareIcon.getBoundingClientRect();
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
    const rect = this.refs.dotsIcon.getBoundingClientRect();
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
