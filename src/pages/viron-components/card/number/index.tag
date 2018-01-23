viron-components-page-number.ComponentsPage_Card_Number
  .ComponentsPage_Card_Number__head
    .ComponentsPage_Card_Number__title { opts.def.name }
  .ComponentsPage_Card_Number__body
    virtual(if="{ isLoading }")
      .ComponentsPage_Card_Number__progress
        viron-icon-reload
    virtual(if="{ !isLoading }")
      // エラー時
      virtual(if="{ !!error }")
        .ComponentsPage_Card_Number__error { error }
      // 正常時
      virtual(if="{ !error }")
        .ComponentsPage_Card_Number__valueWrapper
          .ComponentsPage_Card_Number__value { getValue() }
          .ComponentsPage_Card_Number__unit(if="{ !!data.unit }") { data.unit }
  .ComponentsPage_Card_Number__blocker(if="{ isLoading }")

  script.
    import '../../../../components/icons/viron-icon-reload/index.tag';
    import script from './index';
    this.external(script);
