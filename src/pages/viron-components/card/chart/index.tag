viron-components-page-chart.ComponentsPage_Card_Chart
  .ComponentsPage_Card_Chart__head
    .ComponentsPage_Card_Chart__title { opts.def.name }
  .ComponentsPage_Card_Chart__body
    virtual(if="{ isLoading }")
      .ComponentsPage_Card_Chart__progress
        viron-icon-reload
    virtual(if="{ !isLoading }")
      // エラー時
      virtual(if="{ !!error }")
        .ComponentsPage_Card_Chart__error { error }
      // 正常時
      virtual(if="{ !error }")
        .ComponentsPage_Card_Chart__canvas(ref="canvas" id="{ _riot_id }")
  .ComponentsPage_Card_Chart__blocker(if="{ isLoading }")

  script.
    import '../../../../components/icons/viron-icon-reload/index.tag';
    import script from './index';
    this.external(script);
