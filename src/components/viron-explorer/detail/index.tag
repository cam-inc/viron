viron-explorer-detail.Explorer_Detail
  .Explorer_Detail__head
    .Explorer_Detail__close(onTap="{ handleCloseTap }")
      viron-icon-close
    .Explorer_Detail__delete(if="{ opts.isDeletable }" onTap="{ handleDeleteTap }") 削除
  .Explorer_Detail__body
    .Explorer_Detail__inner(if="{ isReady }")
      .Explorer_Detail__image(class="{ 'Explorer_Detail__image--small': isMobile }" style="background-image:url({ selectedPath })")
      .Explorer_Detail__infos
        .Explorer_Detail__info
          .Explorer_Detail__infoLabel ID
          .Explorer_Detail__infoValue(onTap="{ handleIdTap }") { selectedId }
        .Explorer_Detail__info
          .Explorer_Detail__infoLabel この画像のアドレス
          .Explorer_Detail__infoValue(onTap="{ handlePathTap }") { selectedPath }
      viron-button(if="{ opts.isInsertable }" label="この画像を挿入" onSelect="{ handleInsertTap }")
  .Explorer_Detail__tail(if="{ hasPagination }")
    .Explorer_Detail__pageButton(class="{ 'Explorer_Detail__pageButton--disabled': !isPrevEnabled }" onTap="{ handlePrevTap }")
      viron-icon-arrow-left
    .Explorer_Detail__pageButton(class="{ 'Explorer_Detail__pageButton--disabled': !isNextEnabled }" onTap="{ handleNextTap }")
      viron-icon-arrow-right

  script.
    import '../../../components/icons/viron-icon-arrow-left/index.tag';
    import '../../../components/icons/viron-icon-arrow-right/index.tag';
    import '../../../components/viron-button/index.tag';
    import '../../../components/icons/viron-icon-close/index.tag';
    import script from './index';
    this.external(script);
