viron-application-menu.Application_Menu
  .Application_Menu__head
    .Application_Menu__icon
      viron-icon-square
    .Application_Menu__logo(onTap="{ handleLogoTap }")
      viron-icon-logo
  .Application_Menu__body
    .Application_Menu__section(each="{ section in menu }")
      .Application_Menu__sectionName { section.name }
      .Application_Menu__groups
        viron-application-menu-group(each="{ group in section.groups }" group="{ group }")

  script.
    import '../../components/icons/viron-icon-logo/index.tag';
    import '../../components/icons/viron-icon-square/index.tag';
    import './group/index.tag';
    import script from './index';
    this.external(script);
