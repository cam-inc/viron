viron-components-page-filter.ComponentsPage_Filter(class="ComponentsPage_Filter--{ layoutType }")
  .ComponentsPage_Filter__head
    .ComponentsPage_Filter__closeButton(onTap="{ handleCloseButtonTap }")
      viron-icon-close
    .ComponentsPage_Filter__title 表示項目フィルター
    .ComponentsPage_Filter__description テーブルに表示する項目を選択できます。表示させたい項目をONにしてください。
    .ComponentsPage_Filter__control
      .ComponentsPage_Filter__item
        viron-checkbox(label="全て選択する" isChecked="{ isAllSelected }" theme="ghost" onChange="{ handleAllSelectChange }" )
  .ComponentsPage_Filter__body
    .ComponentsPage_Filter__item(each="{ column in columns }")
      viron-checkbox(id="{ column.key }" label="{ column.description || column.key }" isChecked="{ column.isSelected }" theme="ghost" onChange="{ handleItemChange }")
  .ComponentsPage_Filter__tail
    viron-button(label="適用する" isDisabled="{ isApplyButtonDisabled }" onSelect="{ handleApplyButtonTap }")

  script.
    import '../../../components/icons/viron-icon-close/index.tag';
    import '../../../components/viron-button/index.tag';
    import '../../../components/viron-checkbox/index.tag';

    import script from './index';
    this.external(script);
