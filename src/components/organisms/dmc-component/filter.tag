dmc-component-filter.ComponentFilter
  .ComponentFilter__head
    .ComponentFilter__title 表示項目フィルター
    .ComponentFilter__description テーブルに表示する項目を選択できます。表示させたい項目をONにしてください。
  .ComponentFilter__items
    dmc-component-filter-item(each="{ item in items }" item="{ item }" onToggle="{ parent.handleItemToggle }")
  .ComponentFilter__tail
    dmc-button(label="適用する" onPat="{ handleApplyButtonPat }")

  script.
    import './filter-item.tag';
    import script from './filter';
    this.external(script);
