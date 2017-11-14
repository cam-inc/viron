viron-application-header.Application_Header
  .Application_Header__item
    virtual(if="{ isTopPage }")
      viron-icon-search.Application_Header__searchIcon(ref="searchIcon" onTap="{ handleSearchIconTap }")
    virtual(if="{ !isTopPage }")
      virtual(if="{ isMenuOpened }")
        viron-icon-menu(onTap="{ handleMenuToggleButtonTap }")
      virtual(if="{ !isMenuOpened }")
        viron-icon-menu-invert(onTap="{ handleMenuToggleButtonTap }")
  .Application_Header__item
    viron-icon-square.Application_Header__squareIcon(ref="squareIcon" onTap="{ handleSquareIconTap }")
    viron-icon-dots.Application_Header__dotsIcon(ref="dotsIcon" onTap="{ handleDotsIconTap }")

  script.
    import '../../components/icons/viron-icon-dots/index.tag';
    import '../../components/icons/viron-icon-menu/index.tag';
    import '../../components/icons/viron-icon-menu-invert/index.tag';
    import '../../components/icons/viron-icon-search/index.tag';
    import '../../components/icons/viron-icon-square/index.tag';
    import script from './index';
    this.external(script);
