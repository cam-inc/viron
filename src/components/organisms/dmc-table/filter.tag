dmc-table-filter.Table__filter
  dmc-checkbox(each="{ item in items }" label="{ item.label }" isChecked="{ item.isChecked }" id="{ item.id }" onChange="{ parent.handleCheckboxChange }")

  script.
    import '../../atoms/dmc-checkbox/index.tag';
    import script from './filter';
    this.external(script);
