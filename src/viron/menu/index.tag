viron-application-menu.Application_Menu(class="Application_Menu--{ layoutType }")
  .Application_Menu__bg
  .Application_Menu__overlay
  .Application_Menu__content
    .Application_Menu__head
      .Application_Menu__homeButton(onTap="{ handleHomeButtonTap }")
        viron-icon-arrow-left.Application_Menu__arrow
        viron-icon-logo.Application_Menu__logo
    .Application_Menu__body
      .Application_Menu__section(each="{ section in menu }")
        .Application_Menu__sectionName { section.name }
        .Application_Menu__groups
          viron-application-menu-group(each="{ group in section.groups }" group="{ group }" closer="{ parent.closer }")

  script.
    import '../../components/icons/viron-icon-arrow-left/index.tag';
    import '../../components/icons/viron-icon-logo/index.tag';
    import './group/index.tag';
    import script from './index';
    this.external(script);
