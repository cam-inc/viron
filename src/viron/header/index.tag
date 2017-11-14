viron-application-header.Application_Header
  .Application_Header__aside
    viron-icon-search.Application_Header__searchIcon(ref="searchIcon" onTap="{ handleSearchIconTap }")
  .Application_Header__aside
    viron-icon-square.Application_Header__squareIcon(ref="squareIcon" onTap="{ handleSquareIconTap }")
    viron-icon-dots.Application_Header__dotsIcon(ref="dotsIcon" onTap="{ handleDotsIconTap }")

  script.
    import '../../components/icons/viron-icon-dots/index.tag';
    import '../../components/icons/viron-icon-search/index.tag';
    import '../../components/icons/viron-icon-square/index.tag';
    import script from './index';
    this.external(script);
