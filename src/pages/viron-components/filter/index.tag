viron-components-page-filter.ComponentsPage_Filter
  .ComponentsPage_Filter__title 表示項目フィルター
  .ComponentsPage_Filter__description テーブルに表示する項目を選択できます。表示させたい項目をONにしてください。
  .ComponentsPage_Filter__list
    .ComponentsPage_Filter__item(each="{ column in columns }")
      viron-checkbox(id="{ column.key }" label="{ column.description || column.key }" isChecked="{ column.isSelected }" onChange="{ handleItemChange }")
  .ComponentsPage_Filter__control
    viron-button(label="適用する" onSelect="{ handleApplyButtonTap }")

  script.
    import '../../../components/viron-button/index.tag';
    import '../../../components/viron-checkbox/index.tag';
    import script from './index';
    this.external(script);
