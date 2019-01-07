viron-application-header-menu-clear.Application_Header_Menu_Clear
  .Application_Header_Menu_Clear__title { i18n('vrn.header.menu.clear.title') }
  .Application_Header_Menu_Clear__description { i18n('vrn.header.menu.clear.description') }
  .Application_Header_Menu_Clear__control
    viron-button(label="{ i18n('vrn.header.menu.clear.button') }" theme="secondary" onSelect="{ handleClearButtonTap }")

  script.
    import '../../../../components/viron-button/index.tag';
    import script from './index';
    this.external(script);
