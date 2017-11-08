viron-component-filter.ComponentFilter
  .ComponentFilter__head
    .ComponentFilter__title 表示項目フィルター
    .ComponentFilter__description テーブルに表示する項目を選択できます。表示させたい項目をONにしてください。
  .ComponentFilter__items
    viron-component-filter-item(each="{ item in items }" item="{ item }" onToggle="{ parent.handleItemToggle }")
  .ComponentFilter__tail
    viron-button(label="適用する" onPpat="{ handleApplyButtonPpat }")

  script.
    import './filter-item.tag';
    import script from './filter';
    this.external(script);
