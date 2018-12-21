viron-application-header-menu-export.Application_Header_Menu_Export
  .Application_Header_Menu_Export__title { i18n('header_menu_export_title') }
  .Application_Header_Menu_Export__description { i18n('header_menu_export_description') }
  .Application_Header_Menu_Export__control
    viron-button(label="{ i18n('header_menu_export_button') }" onSelect="{ handleExportButtonTap }")

  script.
    import '../../../../components/viron-button/index.tag';
    import script from './index';
    this.external(script);
