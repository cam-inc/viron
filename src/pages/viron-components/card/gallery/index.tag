viron-components-page-gallery.ComponentsPage_Card_Gallery
  .ComponentsPage_Card_Gallery__head
    .ComponentsPage_Card_Gallery__title { opts.def.name }
  .ComponentsPage_Card_Gallery__body
    virtual(if="{ isLoading }")
      .ComponentsPage_Card_Gallery__progress
        viron-icon-reload
    virtual(if="{ !isLoading }")
      // エラー時
      virtual(if="{ !!error }")
        .ComponentsPage_Card_Gallery__error { error }
      // 正常時
      virtual(if="{ !error }")
        .ComponentsPage_Card_Gallery__content
          .ComponentsPage_Card_Gallery__id(if="{ !!selectedItem }") { selectedItem.id }
          .ComponentsPage_Card_Gallery__url(if="{ !!selectedItem }") { selectedItem.url }
          .ComponentsPage_Card_Gallery__upload(if="{ !!postOperation }")
            viron-uploader(accept="image/*" onChange="{ handleUploaderChange }")
            viron-button(label="追加する" isDisabled="{ !file }" onSelect="{ handleAddButtonTap }")
          .ComponentsPage_Card_Gallery__list
            .ComponentsPage_Card_Gallery__item(each="{ item in data }")
              .ComponentsPage_Card_Gallery__itemImage(class="{ 'ComponentsPage_Card_Gallery__itemImage--selected': (selectedItem && selectedItem.id === item.id ) }" style="background-image:url({ item.url })" onTap="{ handleItemImageTap }")
              .ComponentsPage_Card_Gallery__itemDelete(if="{ deleteOperation }" onTap="{ handleItemDeleteTap }")
  .ComponentsPage_Card_Gallery__tail(if="{ hasPagination }")
    viron-pagination(max="{ pagination.max }" size="{ paginationSize }" current="{ pagination.current }" onChange="{ handlePaginationChange }")
  .ComponentsPage_Card_Gallery__blocker(if="{ isLoading }")

  script.
    import '../../../../components/icons/viron-icon-reload/index.tag';
    import '../../../../components/viron-button/index.tag';
    import '../../../../components/viron-pagination/index.tag';
    import '../../../../components/viron-uploader/index.tag';
    import script from './index';
    this.external(script);
