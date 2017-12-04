viron-application-header-menu-import.Application_Header_Menu_Import
  .Application_Header_Menu_Import__title ホームを読み込み
  .Application_Header_Menu_Import__description エンドポイント一覧をホームに反映します。
  .Application_Header_Menu_Import__error(if="{ errorMessage }") { errorMessage }
  .Application_Header_Menu_Import__control
    viron-uploader(accept="application/json" onChange="{ handleFileChange }")
    viron-button(label="読み込む" isDisabled="{ !endpoints }" onSelect="{ handleImportButtonTap }")

  script.
    import '../../../../components/viron-button/index.tag';
    import '../../../../components/viron-uploader/index.tag';
    import script from './index';
    this.external(script);
