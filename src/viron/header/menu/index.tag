viron-application-header-menu.Application_Header_Menu
  .Application_Header_Menu__list
    .Application_Header_Menu__item(each="{ action in actions }" onTap="{ handleItemTap }") { action.label }

  script.
    import script from './index';
    this.external(script);
