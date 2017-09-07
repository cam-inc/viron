dmc-table-cell.Table__cell
  .Table__cellValue(if="{ !isComplex && !isImage }") { value }
  dmc-button(if="{ isComplex && !opts.isdetailmode }" type="secondaryGhost" icon="link" label="詳細" onPat="{ handleDetailPat }")
  .Table__cellComplex(if="{ isComplex && opts.isdetailmode }")
    dmc-prettyprint(data="{ value }")
  .Table__cellImage(if="{ isImage }")
    div(style="background-image:url({ value });")

  script.
    import '../../atoms/dmc-button/index.tag';
    import '../../atoms/dmc-prettyprint/index.tag';
    import script from './cell';
    this.external(script);
