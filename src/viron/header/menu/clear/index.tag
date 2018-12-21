viron-application-header-menu-clear.Application_Header_Menu_Clear
  .Application_Header_Menu_Clear__title { i18n('header_menu_clear_title') }
  .Application_Header_Menu_Clear__description { i18n('header_menu_clear_description') }
  .Application_Header_Menu_Clear__control
    viron-button(label="{ i18n('header_menu_clear_button') }" theme="secondary" onSelect="{ handleClearButtonTap }")

  script.
    import '../../../../components/viron-button/index.tag';
    import script from './index';
    this.external(script);
