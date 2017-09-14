viron-component-filter-item.ComponentFilter__item
  viron-checkbox(isChecked="{ opts.item.isSelected }" label="{ opts.item.label }" onChange="{ handleCheckboxChange }")

  script.
    import '../../atoms/viron-checkbox/index.tag';
    import script from './filter-item';
    this.external(script);
