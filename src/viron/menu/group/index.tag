viron-application-menu-group.Application_Menu_Group(class="{ 'Application_Menu_Group--open': isOpened }")
  virtual(if="{ !opts.group.isIndependent }")
    .Application_Menu_Group__head(onTap="{ handleHeadTap }")
      .Application_Menu_Group__name { opts.group.name }
      viron-icon-arrow-up.Application_Menu_Group__arrow
    .Application_Menu_Group__pages(style="height:{ getPagesHeight() }px")
      .Application_Menu_Group__pagesInner(ref="pagesInner")
        .Application_Menu_Group__page(each="{ page in opts.group.pages }" onTap="{ handlePageTap }") { page.name }
  virtual(if="{ opts.group.isIndependent }")
    .Application_Menu_Group__head(onTap="{ handleIndependentHeadTap }")
      .Application_Menu_Group__name { opts.group.pages[0].name }

  script.
    import '../../../components/icons/viron-icon-arrow-up/index.tag';
    import script from './index';
    this.external(script);
