viron-application-header-menu-import.Application_Header_Menu_Import
  .Application_Header_Menu_Import__title { i18n('header_menu_import_title') }
  .Application_Header_Menu_Import__description { i18n('header_menu_import_description') }
  .Application_Header_Menu_Import__error(if="{ errorMessage }") { errorMessage }
  .Application_Header_Menu_Import__control
    viron-uploader(accept="application/json" onChange="{ handleFileChange }")
    viron-button(label="{ i18n('header_menu_import_button') }" isDisabled="{ !endpoints }" onSelect="{ handleImportButtonTap }")

  script.
    import '../../../../components/viron-button/index.tag';
    import '../../../../components/viron-uploader/index.tag';
    import script from './index';
    this.external(script);
