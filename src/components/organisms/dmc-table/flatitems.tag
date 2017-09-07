dmc-table-flatitems.Table__flatitems
  .Table__flatitemsHead
    .Table__flatitemsTitle 詳細
    .Table__flatitemsDescription テーブル列の全項目を表示しています。
  .Table__flatitemsBody
    .Table__flatitemsList
      dmc-table-item(each="{ item in opts.items }" isDetailMode="{ true }" item="{ item }")
  .Table__flatitemsTail
    dmc-button(label="閉じる" type="secondary" onPat="{ handleCloseButtonPat }")

  script.
    import '../../atoms/dmc-button/index.tag';
    import script from './flatitems';
    this.external(script);
