dmc-table-cell.Table__cell
  div(ref="touch" onTap="handleTap") { value }

  script.
    import script from './cell';
    this.external(script);
