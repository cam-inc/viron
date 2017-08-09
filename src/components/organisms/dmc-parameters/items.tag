dmc-parameter-items.ParameterItems
  .ParameterItems__head
    div TODO + -
  .ParameterItems__body
    virtual(if="{ !isRecursive }")
      dmc-parameter-item(each="{ val, idx in opts.val }" idx="{ idx }" val="{ parent.getItemValue(idx) }" itemsObject="{ parent.itemsObject }" onChange="{ parent.handleItemChange }")
    virtual(if="{ isRecursive }")
      dmc-parameter-items(each="{ val, idx in opts.val }" val="{ parent.getItemValue(idx) }" itemsObject="{ parent.items }" onChange="{ parent.handleItemsChange }")

  script.
    import './item.tag';
    import script from './items';
    this.external(script);
