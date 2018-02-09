viron-explorer.Explorer
  .Explorer__head
    .Explorer__title { opts.def.name }
  .Explorer__body
    virtual(if="{ isLoading }")
      .Explorer__progress
        viron-icon-reload
    virtual(if="{ !isLoading }")
      // エラー時
      virtual(if="{ !!error }")
        .Explorer__error { error }
      // 正常時
      virtual(if="{ !error }")
        .Explorer__content
          .Explorer__id(if="{ !!selectedItem }") { selectedItem.id }
          .Explorer__url(if="{ !!selectedItem }") { selectedItem.url }
          .Explorer__upload(if="{ !!postOperation }")
            viron-uploader(accept="image/*" onChange="{ handleUploaderChange }")
            viron-button(label="追加する" isDisabled="{ !file }" onSelect="{ handleAddButtonTap }")
          .Explorer__list
            .Explorer__item(each="{ item in data }")
              .Explorer__itemImage(class="{ 'Explorer__itemImage--selected': (selectedItem && selectedItem.id === item.id ) }" style="background-image:url({ item.url })" onTap="{ handleItemImageTap }")
              .Explorer__itemDelete(if="{ deleteOperation }" onTap="{ handleItemDeleteTap }")
  .Explorer__tail(if="{ hasPagination }")
    viron-pagination(max="{ pagination.max }" size="{ paginationSize }" current="{ pagination.current }" onChange="{ handlePaginationChange }")
  .Explorer__blocker(if="{ isLoading }")

  script.
    import '../../components/icons/viron-icon-reload/index.tag';
    import '../../components/viron-button/index.tag';
    import '../../components/viron-pagination/index.tag';
    import '../../components/viron-uploader/index.tag';
    import script from './index';
    this.external(script);
