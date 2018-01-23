viron-components-page.ComponentsPage(class="ComponentsPage--{ layoutType }")
  .ComponentsPage__head
    .ComponentsPage__name { name }
    .ComponentsPage__control(if="{ isDesktop }")
      .ComponentsPage__refresh(onTap="{ handleRefreshTap }")
        viron-icon-reload
      .ComponentsPage__crossSearch(if="{ isCrossSearchEnabled }" class="{ 'ComponentsPage__crossSearch--active': hasCrossSearchQueries }" onTap="{ handleCrossSearchTap }")
        viron-icon-search
  .ComponentsPage__container
    viron-components-page-card(each="{ component in components }" def="{ component }" crossSearchQueries="{ parent.getCrossSearchQueriesByDef(component) }")

  script.
    import '../../components/icons/viron-icon-search/index.tag';
    import './card/index.tag';
    import script from './index';
    this.external(script);
