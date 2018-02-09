viron-components-page-explorer.ComponentsPage_Card_Explorer
  .ComponentsPage_Card_Explorer__head
    .ComponentsPage_Card_Explorer__title { opts.def.name }
  .ComponentsPage_Card_Explorer__body
    virtual(if="{ isLoading }")
      .ComponentsPage_Card_Explorer__progress
        viron-icon-reload
    virtual(if="{ !isLoading }")
      // エラー時
      virtual(if="{ !!error }")
        .ComponentsPage_Card_Explorer__error { error }
      // 正常時
      virtual(if="{ !error }")
        .ComponentsPage_Card_Explorer__content
          .ComponentsPage_Card_Explorer__id(if="{ !!selectedItem }") { selectedItem.id }
          .ComponentsPage_Card_Explorer__url(if="{ !!selectedItem }") { selectedItem.url }
          .ComponentsPage_Card_Explorer__upload(if="{ !!postOperation }")
            viron-uploader(accept="image/*" onChange="{ handleUploaderChange }")
            viron-button(label="追加する" isDisabled="{ !file }" onSelect="{ handleAddButtonTap }")
          .ComponentsPage_Card_Explorer__list
            .ComponentsPage_Card_Explorer__item(each="{ item in data }")
              .ComponentsPage_Card_Explorer__itemImage(class="{ 'ComponentsPage_Card_Explorer__itemImage--selected': (selectedItem && selectedItem.id === item.id ) }" style="background-image:url({ item.url })" onTap="{ handleItemImageTap }")
              .ComponentsPage_Card_Explorer__itemDelete(if="{ deleteOperation }" onTap="{ handleItemDeleteTap }")
  .ComponentsPage_Card_Explorer__tail(if="{ hasPagination }")
    viron-pagination(max="{ pagination.max }" size="{ paginationSize }" current="{ pagination.current }" onChange="{ handlePaginationChange }")
  .ComponentsPage_Card_Explorer__blocker(if="{ isLoading }")

  script.
    import '../../../../components/icons/viron-icon-reload/index.tag';
    import '../../../../components/viron-button/index.tag';
    import '../../../../components/viron-pagination/index.tag';
    import '../../../../components/viron-uploader/index.tag';
    import script from './index';
    this.external(script);
