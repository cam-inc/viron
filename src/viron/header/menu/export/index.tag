viron-application-header-menu-export.Application_Header_Menu_Export
  .Application_Header_Menu_Export__title ホームを保存
  .Application_Header_Menu_Export__description ホームのエンドポイント一覧をjsonファイルとして書き出します。
  .Application_Header_Menu_Export__control
    viron-button(label="保存する" onSelect="{ handleExportButtonTap }")

  script.
    import '../../../../components/viron-button/index.tag';
    import script from './index';
    this.external(script);
