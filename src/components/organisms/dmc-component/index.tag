dmc-component.Component
  .Component__head
    .Component__name { opts.component.name }
    .Component__refresh(ref="touch" onTap="handleRefreshButtonTap")
      dmc-icon(type="reload")
    .Component__search(if="{ !!getParameterObjectsForSearch().length }" class="{ !isCurrentRequestParametersEmpty() ? 'Component__search--active' : ''}" ref="touch" onTap="handleSearchButtonTap")
      dmc-icon(type="search")
  .Component__body(ref="body")
    .Component__spinner(if="{ isPending }")
      dmc-icon(type="loading")
    dmc-pagination.Component__pagination.Component__pagination--head(if="{ !isPending &&  hasPagination }" currentPage="{ pagination.currentPage }" maxPage="{ pagination.maxPage }" size="{ paginationSize }" onChange="{ handlePaginationChange }")
    div(data-is="{ childComponentName }" if="{ !isPending && isValidData }" response="{ response }" schemaObject="{ schemaObject }" tableLabels="{ tableLabels }" rowActions="{ rowActions }" updater="{ updater }")
    dmc-pagination.Component__pagination.Component__pagination--tail(if="{ !isPending && hasPagination }" currentPage="{ pagination.currentPage }" maxPage="{ pagination.maxPage }" size="{ paginationSize }" onChange="{ handlePaginationChange }")
    .Component__alert(if="{ !isPending && !isValidData }")
      .Component__alertApi { alertApi }
      .Component__alertText { alertText }
  .Component__tail(if="{ !!selfActions }")
    dmc-component-action(each="{ action in selfActions }" action="{ action }" updater="{ parent.updater }")

  script.
    import '../../organisms/dmc-pagination/index.tag';
    import '../../atoms/dmc-icon/index.tag';
    import './action.tag';
    import './graph-bar.tag';
    import './graph-horizontal-bar.tag';
    import './graph-horizontal-stacked-bar.tag';
    import './graph-line.tag';
    import './graph-scatterplot.tag';
    import './graph-stacked-area.tag';
    import './graph-stacked-bar.tag';
    import './number.tag';
    import './table.tag';
    import script from './index';
    this.external(script);
