viron-parameters-items.Parameters_Items
  .Parameters_Items__head
    .Parameters_Items__error(if="{ hasError }")
      viron-parameters-popover(message="{ errors[0] }")
    .Parameters_Items__addButton(onTap="{ handleAddButtonTap }")
      viron-icon-plus
    .Parameters_Items__label { opts.label }{ opts.required ? ' *' : '' }
    .Parameters_Items__openButton(onTap="{ handleOpenAllButtonTap }") 項目をすべて開く
  .Parameters_Items__body(if="{ !!opts.val && !!opts.val.length }")
    .Parameters_Items__item(each="{ val, idx in opts.val }" class="{ 'Parameters_Items__item--opened': parent.isItemOpened(idx) }")
      .Parameters_Items__itemDetail
        .Parameters_Items__itemHead
          .Parameters_Items__removeButton(onTap="{ handleRemoveButtonTap }") この項目を削除
        .Parameters_Items__itemBody
          virtual(if="{ parent.isFormMode }")
            viron-parameters-form(no-reorder identifier="{ idx }" val="{ val }" formObject="{ parent.formObject }"  onChange="{ parent.handleItemChange }")
          virtual(if="{ parent.isPropertiesMode }")
            viron-parameters-properties(no-reorder label="{ parent.opts.label }[{ idx }]" identifier="{ idx }" val="{ val }" propertiesObject="{ parent.propertiesObject }" onChange="{ parent.handleItemChange }")
          virtual(if="{ parent.isItemsMode }")
            viron-parameters-items(no-reorder label="{ parent.opts.label }[{ idx }]" identifier="{ idx }" val="{ val }" schemaObject="{ parent.schemaObject.items }" onChange="{ parent.handleItemChange }")
        .Parameters_Items__itemTail
          .Parameters_Items__removeButton(onTap="{ handleRemoveButtonTap }") この項目を削除
          .Parameters_Items__closeButton(onTap="{ handleCloseButtonTap }")
            .Parameters_Items__closeButtonLabel とじる
            viron-icon-check
      .Parameters_Items__itemBrief(onTap="{ handleItemBriefTap }")
        div TODO: 簡略版

  script.
    import '../../../components/icons/viron-icon-check/index.tag';
    import '../../../components/icons/viron-icon-plus/index.tag';
    import '../form/index.tag';
    import '../popover/index.tag';
    import '../properties/index.tag';
    import script from './index';
    this.external(script);
