dmc-table.Table
  .Table__head
    .Table__headRow
      .Table__headCell(each="{ getColumns() }") { title }
  .Table__body
    .Table__row(each="{ row in getRows() }")
      dmc-table-cell(each="{ cell in row }" cell="{ cell }")

  script.
    import { forEach } from 'mout/array';

    getColumns() {
      // TODO: 必要に応じて機能と追加すること。
      // TODO: columnsを編集すればrowsも自動的に変更される想定
      return this.opts.columns;
    }

    getRows() {
      const columns = this.getColumns();
      const rows = [];
      forEach(this.opts.rows, row => {
        const arrayedRow = [];
        forEach(columns, column => {
          arrayedRow.push(row[column.key]);
        });
        rows.push(arrayedRow);
      });
      return rows;
    }

dmc-table-cell.Table__cell
  div(if="{ !opts.cell.isAction }" onClick="{ handleClick }") { value }
  virtual(if="{ opts.cell.isAction }")
    dmc-table-cell-action(each="{ action in opts.cell.actions }" action="{ action }")

  script.
    import constants from '../../core/constants';
    import '../atoms/dmc-prettyprint.tag';

    const store = this.riotx.get();

    this.value = null;
    if (!this.opts.cell.isAction) {
      switch (this.opts.cell.data.getType()) {
        case 'null':
          this.value = 'null';
          break;
        case 'boolean':
          this.value = this.opts.cell.data.getValue() ? 'O' : 'X';
          break;
        case 'number':
          this.value = this.opts.cell.data.getValue();
          break;
        case 'string':
          // TODO: 画像表示
          this.value = this.opts.cell.data.getValue();
          break;
        case 'object':
        case 'array':
          this.value = '[詳細を見る]';
          break;
        default:
          break;
      }
    }

    handleClick(e) {
      e.preventUpdate = false;
      e.stopPropagation();
      const type = this.opts.cell.data.getType();
      if (type !== 'object' && type !== 'array') {
        return;
      }
      store.action(constants.ACTION_MODAL_SHOW, 'dmc-prettyprint', {
        data : this.opts.cell.data.getRawValue()
      });
    }

dmc-table-cell-action.Table__action
  dmc-button(label="{ opts.action.value }" onClick="{ handleButtonClick }" onHoverToggle="{ handleButtonHoverToggle }" )
  dmc-tooltip(if="{ isTooltipOpened }" message="{ tooltipMessage }")

  script.
    import '../atoms/dmc-button.tag';
    import '../atoms/dmc-tooltip.tag';

    this.isTooltipOpened = false;
    this.tooltipMessage = this.opts.action.tooltip;

    handleButtonClick() {
      this.opts.action.onClick(this.opts.action.id, this.opts.action.rowData);
    }

    handleButtonHoverToggle(isHovered) {
      if (!this.tooltipMessage) {
        return;
      }
      this.isTooltipOpened = isHovered;
      this.update();
    }
