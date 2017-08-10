dmc-parameter-items.ParameterItems
  .ParameterItems__head
    .ParameterItems__addButton(ref="touch" onTap="handleAddButtonTap")
      dmc-icon(type="plus")
    .ParameterItems__removeButton(if="{ opts.withremove }" ref="touch" onTap="handleRemoveButtonTap")
      dmc-icon(type="minus")
  .ParameterItems__body
    virtual(if="{ !isRecursive }")
      dmc-parameter-item(each="{ val, idx in opts.val }" idx="{ idx }" val="{ parent.getItemValue(idx) }" itemsObject="{ parent.itemsObject }" onRemove="{ parent.handleItemRemove }" onChange="{ parent.handleItemChange }")
    virtual(if="{ isRecursive }")
      dmc-parameter-items(each="{ val, idx in opts.val }" withRemove="{ true }" idx="{ idx }" val="{ parent.getItemValue(idx) }" itemsObject="{ parent.items }" onRemove="{ parent.handleItemRemove }" onChange="{ parent.handleItemChange }")

  script.
    import '../../atoms/dmc-icon/index.tag';
    import './item.tag';
    import script from './items';
    this.external(script);
