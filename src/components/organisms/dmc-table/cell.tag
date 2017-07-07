dmc-table-cell.Table__cell
  .Table__cellValue(if="{ !isComplex && !isImage }") { value }
  .Table__cellButton(if="{ isComplex }" ref="touch" onTap="handleTap") { value }
  .Table__cellImage(if="{ isImage }")
    div(style="background-image:url({ value });")

  script.
    import script from './cell';
    this.external(script);
