viron-application-menu-group.Application_Menu_Group
  virtual(if="{ !opts.group.isIndependent }")
    .Application_Menu_Group__head(onTap="{ handleHeadTap }")
      .Application_Menu_Group__name { opts.group.name }
      .Application_Menu_Group__icon
        viron-icon-square
    .Application_Menu_Group__pages(if="{ isOpened }")
      .Application_Menu_Group__page(each="{ page in opts.group.pages }" onTap="{ handlePageTap }") { page.name }
  virtual(if="{ opts.group.isIndependent }")
    .Application_Menu_Group__head(onTap="{ handleIndependentHeadTap }")
      .Application_Menu_Group__name { opts.group.pages[0].name }

  script.
    import '../../../components/icons/viron-icon-square/index.tag';
    import script from './index';
    this.external(script);
