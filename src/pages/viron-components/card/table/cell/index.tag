viron-components-page-table-cell.ComponentsPage_Card_Table_Cell
  virtual(if="{ !isMedia }")
    .ComponentsPage_Card_Table_Cell__string { value }
  virtual(if="{ isMedia }")
    virtual(if="{ isImage }")
      .ComponentsPage_Card_Table_Cell__image(style="background-image:url({ value })")

  script.
    import script from './index';
    this.external(script);
