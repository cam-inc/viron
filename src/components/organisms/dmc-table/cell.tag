dmc-table-cell.Table__cell
  div(if="{ !opts.cell.isAction }" ref="touch" onTap="handleTap") { value }
  virtual(if="{ opts.cell.isAction }")
    dmc-table-cell-action(each="{ action in opts.cell.actions }" action="{ action }")

  script.
    import './cell-action.tag';
    import script from './cell';
    this.external(script);
