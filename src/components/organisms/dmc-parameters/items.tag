dmc-parameter-items.ParameterItems
  .ParameterItems__head
    div TODO + -
  .ParameterItems__body
    virtual(if="{ !isRecursive }")
      dmc-parameter-item(each="{ item, idx in itemsParameters}" idx="{ idx }" schemaObject="{ parent.opts.itemsobject }")
    virtual(if="{ isRecursive }")
      dmc-parameter-items(val="{ opts.val }" itemsObject="{ items }")

  script.
    import './item.tag';
    import script from './items';
    this.external(script);
