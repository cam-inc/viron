dmc-parameter-items.ParameterItems(class="{ isInfoOpened ? 'ParameterItems--infoOpened' : '' } { isBodyOpened ? 'ParameterItems--bodyOpened' : '' }")
  .ParameterItems__head
    .ParameterItems__caption
      .ParameterItems__bodyOpenShutButton(ref="touch" onTap="handleBodyOpenShutButtonTap")
        dmc-icon(type="right")
      .ParameterItems__name(ref="touch" onTap="handleNameTap") { name }
      .ParameterItems__line
      .ParameterItems__addButton(ref="touch" onTap="handleAddButtonTap")
        dmc-icon(type="plusCircle")
      .ParameterItems__removeButton(if="{ opts.withremove }" ref="touch" onTap="handleRemoveButtonTap")
        dmc-icon(type="minusCircle")
      .ParameterItems__infoOpenShutButton(ref="touch" onTap="handleInfoOpenShutButtonTap")
        dmc-icon(type="infoCirlceO")
    .ParameterItems__info
      .ParameterItems__type type: { type }
  .ParameterItems__body
    virtual(if="{ !isRecursive }")
      dmc-parameter-item(no-reorder each="{ val, idx in opts.val }" idx="{ idx }" val="{ parent.getItemValue(idx) }" itemsObject="{ parent.itemsObject }" onRemove="{ parent.handleItemRemove }" onChange="{ parent.handleItemChange }")
    virtual(if="{ isRecursive }")
      dmc-parameter-items(no-reorder each="{ val, idx in opts.val }" withRemove="{ true }" idx="{ idx }" val="{ parent.getItemValue(idx) }" itemsObject="{ parent.items }" onRemove="{ parent.handleItemRemove }" onChange="{ parent.handleItemChange }")

  script.
    import '../../atoms/dmc-icon/index.tag';
    import './item.tag';
    import script from './items';
    this.external(script);
