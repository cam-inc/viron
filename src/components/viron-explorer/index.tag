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
          form.Explorer__droparea(if="{ !!postOperation }" ref="form" class="{ 'Explorer__droparea--active': isDragWatching }")
            input.Explorer__input(type="file" id="{ inputId }" accept="image/*" onChange="{ handleFileChange }")
            .Explorer__dropareaLabel ここにファイルをドロップして追加できます
            .Explorer__dragHandler(onDragEnter="{ handleHandlerDragEnter }" onDragOver="{ handleHandlerDragOver }" onDragLeave="{ handleHandlerDragLeave }" onDrop="{ handleHandlerDrop }")
            label.Explorer__dropareaButton(for="{ inputId }") ファイルを選択
          .Explorer__list(if="{ !!data && !!data.length }" ref="list")
            .Explorer__item(each="{ item, idx in data }" ref="item_{ idx }" style="background-image:url({ item.url })" onTap="{ handleItemTap }")
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
