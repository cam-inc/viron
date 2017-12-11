viron-components-page-graph-bar.ComponentsPage_Card_GraphBar
  .ComponentsPage_Card_GraphBar__head
    .ComponentsPage_Card_GraphBar__title { opts.def.name }
    .ComponentsPage_Card_GraphBar__control
      viron-icon-reload(onTap="{ handleRefreshButtonTap }")
  .ComponentsPage_Card_GraphBar__body
    virtual(if="{ isLoading }")
      .ComponentsPage_Card_GraphBar__progress
        viron-icon-reload
    virtual(if="{ !isLoading }")
      // エラー時
      virtual(if="{ !!error }")
        .ComponentsPage_Card_GraphBar__error { error }
      // 正常時
      virtual(if="{ !error }")
        .ComponentsPage_Card_GraphBar__canvas(ref="canvas" id="{ _riot_id }")
  .ComponentsPage_Card_GraphBar__blocker(if="{ isLoading }")

  script.
    import '../../../../components/icons/viron-icon-reload/index.tag';
    import script from './index';
    this.external(script);
