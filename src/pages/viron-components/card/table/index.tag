viron-components-page-table.ComponentsPage_Card_Table
  .ComponentsPage_Card_Table__head
    .ComponentsPage_Card_Table__headAside
      .ComponentsPage_Card_Table__postOperation(if="{ postOperation }" onTap="{ handlePostButtonTap }")
        viron-icon-plus
      .ComponentsPage_Card_Table__title { opts.def.name }
    .ComponentsPage_Card_Table__headAside
      .ComponentsPage_Card_Table__control
        viron-icon-search(if="{ searchParameters.length }" onTap="{ handleSearchButtonTap }")
        viron-icon-filter(onTap="{ handleFilterButtonTap }")
        viron-icon-reload(onTap="{ handleReloadButtonTap }")
        viron-icon-setting(if="{ tableOperations.length }" ref="settingIcon" onTap="{ handleSettingButtonTap }")
  .ComponentsPage_Card_Table__body(if="{ !isLoading }")
    // エラー時
    virtual(if="{ !!error }")
      .ComponentsPage_Card_Table__error { error }
    // 正常時
    virtual(if="{ !error }")
      .ComponentsPage_Card_Table__tableWrapper
        table.ComponentsPage_Card_Table__table
          thead.ComponentsPage_Card_Table__thead
            tr.ComponentsPage_Card_Table__theadRow
              th.ComponentsPage_Card_Table__th(each="{ column in columns }") { column.description || column.key }
              th.ComponentsPage_Card_Table__th(if="{ rowOperations.length }")
          tbody.ComponentsPage_Card_Table__tbody
            tr.ComponentsPage_Card_Table__tbodyRow(each="{ row in data }" onTap="{ handleRowTap }")
              td(each="{ column in columns }" data-is="viron-components-page-table-cell" data="{ row[column.key] }")
              td.ComponentsPage_Card_Table__td(if="{ rowOperations.length }")
                viron-icon-setting(ref="rowSettingIcon" onTap="{ handleRowSettingButtonTap }")

  script.
    import '../../../../components/icons/viron-icon-filter/index.tag';
    import '../../../../components/icons/viron-icon-plus/index.tag';
    import '../../../../components/icons/viron-icon-reload/index.tag';
    import '../../../../components/icons/viron-icon-search/index.tag';
    import '../../../../components/icons/viron-icon-setting/index.tag';
    import './cell/index.tag';
    import script from './index';
    this.external(script);
