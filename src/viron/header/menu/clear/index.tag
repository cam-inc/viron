viron-application-header-menu-clear.Application_Header_Menu_Clear
  .Application_Header_Menu_Clear__title 全てのカードを削除
  .Application_Header_Menu_Clear__description ホームのエンドポイント一覧を空にします。この操作は取り消せません。
  .Application_Header_Menu_Clear__control
    viron-button(label="削除する" theme="secondary" onSelect="{ handleClearButtonTap }")

  script.
    import '../../../../components/viron-button/index.tag';
    import script from './index';
    this.external(script);
