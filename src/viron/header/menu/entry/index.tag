viron-application-header-menu-entry.Application_Header_Menu_Entry
  div 新しい管理画面を追加する
  div forms...
  .Application_Header_Menu_Entry__control
    viron-button(label="追加" onSelect="{ handleAddButtonSelect }")
    viron-button(theme="ghost" label="キャンセル" onSelect="{ handleCancelButtonSelect }")

  script.
    import '../../../../components/viron-button/index.tag';
    import script from './index';
    this.external(script);
