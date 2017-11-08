viron-table-cell.Table__cell
  .Table__cellValue(if="{ !isComplex && !isImage }") { value }
  viron-button(if="{ isComplex && !opts.isdetailmode }" type="secondaryGhost" icon="link" label="詳細" onPpat="{ handleDetailPpat }")
  .Table__cellComplex(if="{ isComplex && opts.isdetailmode }")
    viron-prettyprint(data="{ value }")
  .Table__cellImage(if="{ isImage }")
    div(style="background-image:url({ value });")

  script.
    import '../../atoms/viron-button/index.tag';
    import '../../atoms/viron-prettyprint/index.tag';
    import script from './cell';
    this.external(script);
