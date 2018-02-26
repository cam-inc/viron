viron-explorer.Explorer
  .Explorer__head
    .Explorer__title { opts.def.name }
    .Explorer__control
      viron-icon-search.Explorer__searchIcon
  .Explorer__body
    virtual(if="{ isLoading }")
      .Explorer__progressWrapper
        .Explorer__progress
          viron-icon-reload
    virtual(if="{ !isLoading }")
      // エラー時
      virtual(if="{ !!error }")
        .Explorer__error { error }
      // 正常時
      virtual(if="{ !error }")
        .Explorer__content
          .Explorer__label ライブラリ
          .Explorer__droparea(if="{ !!postOperation }")
            .Explorer__dropareaLabel ここにファイルをドロップして追加できます
            .Explorer__dropareaButton ファイルを選択
          .Explorer__id(if="{ !!selectedItem }") { selectedItem.id }
          .Explorer__url(if="{ !!selectedItem }") { selectedItem.url }
          .Explorer__list(if="{ !!data && !!data.length }" ref="list")
            .Explorer__item(each="{ item, idx in data }" ref="item_{ idx }" style="background-image:url({ item.url })")
  .Explorer__tail(if="{ hasPagination }")
    viron-pagination(max="{ pagination.max }" size="{ paginationSize }" current="{ pagination.current }" onChange="{ handlePaginationChange }")
  .Explorer__blocker(if="{ isLoading }")

  script.
    import '../../components/icons/viron-icon-reload/index.tag';
    import '../../components/icons/viron-icon-search/index.tag';
    import '../../components/viron-button/index.tag';
    import '../../components/viron-pagination/index.tag';
    import script from './index';
    this.external(script);
