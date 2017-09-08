dmc-component-filter-item.ComponentFilter__item
  dmc-checkbox(isChecked="{ opts.item.isSelected }" label="{ opts.item.label }" onChange="{ handleCheckboxChange }")

  script.
    import script from './filter-item';
    this.external(script);
