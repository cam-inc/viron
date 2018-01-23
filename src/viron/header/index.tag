viron-application-header.Application_Header
  .Application_Header__item
    virtual(if="{ isTopPage && isDesktop }")
      viron-application-header-filter
    virtual(if="{ isTopPage && isMobile }")
      viron-icon-logo
    virtual(if="{ !isTopPage }")
      virtual(if="{ isMenuOpened }")
        viron-icon-menu(class="Application_Header__menuIcon" onTap="{ handleMenuToggleButtonTap }")
      virtual(if="{ !isMenuOpened }")
        viron-icon-menu-invert(class="Application_Header__menuIcon" onTap="{ handleMenuToggleButtonTap }")
  .Application_Header__item(if="{ !isTopPage && isMobile }")
    .Application_Header__thumbnail(style="background-image:url({ thumbnail })")
  .Application_Header__item.Application_Header__item--tail
    virtual(if="{ !isTopPage }")
      virtual(if="{ !isMobile }")
        .Application_Header__info(onTap="{ handleInfoTap }")
          .Application_Header__color(class="Application_Header__color--{ color }")
          .Application_Header__name { name }
          viron-icon-arrow-right.Application_Header__arrow
          .Application_Header__thumbnail(ref="thumbnail" style="background-image:url({ thumbnail })")
    viron-icon-dots.Application_Header__dotsIcon(ref="dotsIcon" onTap="{ handleDotsIconTap }")

  script.
    import '../../components/icons/viron-icon-arrow-right/index.tag';
    import '../../components/icons/viron-icon-dots/index.tag';
    import '../../components/icons/viron-icon-logo/index.tag';
    import '../../components/icons/viron-icon-menu/index.tag';
    import '../../components/icons/viron-icon-menu-invert/index.tag';
    import '../../components/icons/viron-icon-square/index.tag';
    import './filter/index.tag';
    import script from './index';
    this.external(script);
