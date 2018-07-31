viron-components-page-table.ComponentsPage_Card_Table
  .ComponentsPage_Card_Table__head
    .ComponentsPage_Card_Table__headAside
      .ComponentsPage_Card_Table__postOperation(if="{ postOperation }" onTap="{ handlePostButtonTap }")
        viron-icon-plus-thin
      .ComponentsPage_Card_Table__title { opts.def.name }
    .ComponentsPage_Card_Table__headAside
      .ComponentsPage_Card_Table__control
        viron-icon-search.ComponentsPage_Card_Table__searchIcon(if="{ searchParameters.length }" class="{ 'ComponentsPage_Card_Table__searchIcon--active': hasSearchQueries }" onTap="{ handleSearchButtonTap }")
        viron-icon-filter.ComponentsPage_Card_Table__filterIcon(class="{ 'ComponentsPage_Card_Table__filterIcon--active': !!visibleColumnKeys }" onTap="{ handleFilterButtonTap }")
        viron-icon-setting(if="{ tableOperations.length }" ref="settingIcon" onTap="{ handleSettingButtonTap }")
  .ComponentsPage_Card_Table__body
    virtual(if="{ isLoading }")
      .ComponentsPage_Card_Table__progressWrapper
        .ComponentsPage_Card_Table__progress
          viron-icon-reload
    virtual(if="{ !isLoading }")
      // エラー時
      virtual(if="{ !!error }")
        .ComponentsPage_Card_Table__errorWrapper
          .ComponentsPage_Card_Table__error { error }
      // 正常時
      virtual(if="{ !error }")
        table.ComponentsPage_Card_Table__table
          thead.ComponentsPage_Card_Table__thead
            tr.ComponentsPage_Card_Table__theadRow
              th.ComponentsPage_Card_Table__th(each="{ column in getFilteredColumns() }" class="{ 'ComponentsPage_Card_Table__th--sortable': column.isSortable }" onTap="{ handleSortThTap }")
                .ComponentsPage_Card_Table__thInner
                  .ComponentsPage_Card_Table__thInnerCtrl(if="{ column.isSortable }")
                    viron-icon-arrow-up.ComponentsPage_Card_Table__thIcon(class="{ 'ComponentsPage_Card_Table__thIcon--active' : isAsc(column.key) }")
                    viron-icon-arrow-down.ComponentsPage_Card_Table__thIcon(class="{ 'ComponentsPage_Card_Table__thIcon--active' : isDesc(column.key) }")
                  .ComponentsPage_Card_Table__thInnerLabel { column.description || column.key }
              th.ComponentsPage_Card_Table__th.ComponentsPage_Card_Table__th--sticky(if="{ rowOperations.length }")
                .ComponentsPage_Card_Table__thInner
                  .ComponentsPage_Card_Table__thInnerLabel 操作
          tbody.ComponentsPage_Card_Table__tbody
            tr.ComponentsPage_Card_Table__tbodyRow(each="{ row, idx in data }" onTap="{ handleRowTap }")
              td(each="{ column in parent.getFilteredColumns() }" data-is="viron-components-page-table-cell" data="{ row[column.key] }" column="{ column }")
              td.ComponentsPage_Card_Table__td.ComponentsPage_Card_Table__td--sticky(if="{ rowOperations.length }")
                span(data-is="viron-icon-{ rowOperationsIcon }" ref="rowSettingIcon" onTap="{ handleRowSettingButtonTap }")
  .ComponentsPage_Card_Table__tail(if="{ hasPagination }")
    viron-pagination(max="{ pagination.max }" size="{ paginationSize }" current="{ pagination.current }" onChange="{ handlePaginationChange }")
  .ComponentsPage_Card_Table__blocker(if="{ isLoading }")

  script.
    import '../../../../components/icons/viron-icon-arrow-down/index.tag';
    import '../../../../components/icons/viron-icon-arrow-up/index.tag';
    import '../../../../components/icons/viron-icon-edit/index.tag';
    import '../../../../components/icons/viron-icon-file/index.tag';
    import '../../../../components/icons/viron-icon-filter/index.tag';
    import '../../../../components/icons/viron-icon-plus/index.tag';
    import '../../../../components/icons/viron-icon-plus-thin/index.tag';
    import '../../../../components/icons/viron-icon-reload/index.tag';
    import '../../../../components/icons/viron-icon-remove/index.tag';
    import '../../../../components/icons/viron-icon-search/index.tag';
    import '../../../../components/icons/viron-icon-setting/index.tag';
    import '../../../../components/viron-pagination/index.tag';
    import './cell/index.tag';
    import script from './index';
    this.external(script);
