import './clear/index.tag';
import './entry/index.tag';
import './export/index.tag';
import './import/index.tag';
import i18n from '../../../core/i18n';

export default function() {
  const store = this.riotx.get();
  const isTopPage = store.getter('location.isTop');
  const isDesktop = store.getter('layout.isDesktop');
  const generalActions = [
    { label: i18n.get('header_menu_help'), id: 'navigate_to_doc' }
  ];
  const endpointActions = [];
  endpointActions.push({ label: i18n.get('header_menu_entry'), id: 'add_endpoint' });
  if (isDesktop) {
    endpointActions.push({ label: i18n.get('header_menu_export'), id: 'export_endpoints' });
    endpointActions.push({ label: i18n.get('header_menu_import'), id: 'import_endpoints' });
  }
  endpointActions.push({ label: i18n.get('header_menu_clear'), id: 'remove_all_endpoints' });

  // TOPページではエンドポイント操作も可能にする。
  if (isTopPage) {
    this.actions = [].concat(endpointActions).concat(generalActions);
  } else {
    this.actions = [].concat(generalActions);
  }

  /**
   * エンドポイント追加用のモーダルを表示します。
   */
  this.showEntryModal = () => {
    store.action('modals.add', 'viron-application-header-menu-entry');
  };

  /**
   * エンドポイント一覧export用のモーダルを表示します。
   */
  this.showExportModal = () => {
    store.action('modals.add', 'viron-application-header-menu-export');
  };

  /**
   * エンドポイント一覧import用のモーダルを表示します。
   */
  this.showImportModal = () => {
    store.action('modals.add', 'viron-application-header-menu-import');
  };

  /**
   * エンドポイント一覧削除用のモーダルを表示します。
   */
  this.showClearModal = () => {
    store.action('modals.add', 'viron-application-header-menu-clear');
  };

  /**
   * メニュー項目がクリック/タップされた時の処理。
   * @param {String} id
   */
  this.handleActionSelect = id => {
    switch (id) {
    case 'navigate_to_doc':
      window.open('https://cam-inc.github.io/viron-doc/', '_blank');
      this.close();
      break;
    case 'add_endpoint':
      this.showEntryModal();
      this.close();
      break;
    case 'export_endpoints':
      this.showExportModal();
      this.close();
      break;
    case 'import_endpoints':
      this.showImportModal();
      this.close();
      break;
    case 'remove_all_endpoints':
      this.showClearModal();
      this.close();
      break;
    default:
      this.close();
      break;
    }
  };
}
