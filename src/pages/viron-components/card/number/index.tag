viron-components-page-number.ComponentsPage_Card_Number
  .ComponentsPage_Card_Number__head
    .ComponentsPage_Card_Number__title { opts.def.name }
      div(onTap="{ handleRefreshButtonTap }")
    .ComponentsPage_Card_Number__control
  .ComponentsPage_Card_Number__body(if="{ !isLoading }")
    // エラー時
    virtual(if="{ !!error }")
      .ComponentsPage_Card_Number__error { error }
    // 正常時
    virtual(if="{ !error }")
      .ComponentsPage_Card_Number__value { getValue() }
      .ComponentsPage_Card_Number__unit(if="{ !!data.unit }") { data.unit }

  script.
    import script from './index';
    this.external(script);
