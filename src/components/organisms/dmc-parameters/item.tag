dmc-parameters-item.ParameterItem
  .ParameterItem__head
    div item
  .ParameterItem__body
    dmc-parameter-form(val="{ opts.val }" parameterObject="{ itemsObject }" onChange="{ handleFormChange }")

  script.
    import './form.tag';
    import script from './item';
    this.external(item);
