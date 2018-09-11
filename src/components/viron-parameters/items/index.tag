viron-parameters-items.Parameters_Items(class="{ 'Parameters_Items--preview': opts.ispreview } Parameters_Items--{ opts.theme }")
  .Parameters_Items__head
    .Parameters_Items__addButton(if="{ !opts.ispreview }" onTap="{ handleAddButtonTap }")
      viron-icon-plus
    .Parameters_Items__headContent
      .Parameters_Items__label { opts.label }{ opts.required ? ' *' : '' }
      .Parameters_Items__error(if="{ hasError }") { errors[0] }
    .Parameters_Items__openButton(if="{ !!opts.val && !!opts.val.length }" onTap="{ handleOpenAllButtonTap }") 項目をすべて開く
  .Parameters_Items__body(if="{ !!opts.val && !!opts.val.length }")
    .Parameters_Items__item(each="{ val, idx in opts.val }" class="{ 'Parameters_Items__item--opened': parent.isItemOpened(idx) }")
      .Parameters_Items__itemDetail
        .Parameters_Items__itemHead
          .Parameters_Items__closeButton(onTap="{ handleCloseButtonTap }")
            viron-icon-arrow-up
          .Parameters_Items__removeButton(if="{ !parent.opts.ispreview }" onTap="{ handleRemoveButtonTap }") この項目を削除
        .Parameters_Items__itemBody
          virtual(if="{ parent.isFormMode }")
            viron-parameters-form(no-reorder identifier="{ idx }" val="{ val }" theme="{ parent.opts.theme }" isPreview="{ parent.opts.ispreview }" formObject="{ parent.formObject }" onSubmit="{ parent.handleItemSubmit }"  onChange="{ parent.handleItemChange }" onValidate="{ parent.handleItemValidate }")
          virtual(if="{ parent.isPropertiesMode }")
            viron-parameters-properties(no-reorder label="{ parent.opts.label }[{ idx }]" identifier="{ idx }" val="{ val }" theme="{ parent.opts.theme }" isPreview="{ parent.opts.ispreview }" isSwitchable="{ parent.opts.isswitchable }" propertiesObject="{ parent.propertiesObject }" onSubmit="{ parent.handleItemSubmit }"  onChange="{ parent.handleItemChange }" onValidate="{ parent.handleItemValidate }")
          virtual(if="{ parent.isItemsMode }")
            viron-parameters-items(no-reorder label="{ parent.opts.label }[{ idx }]" identifier="{ idx }" val="{ val }" theme="{ parent.opts.theme }" isPreview="{ parent.opts.ispreview }" isSwitchable="{ parent.opts.isswitchable }" schemaObject="{ parent.schemaObject.items }" onSubmit="{ parent.handleItemSubmit }" onChange="{ parent.handleItemChange }" onValidate="{ parent.handleItemValidate }")
      .Parameters_Items__itemBrief(onTap="{ handleItemBriefTap }")
        .Parameters_Items__itemBriefTitle { parent.getBriefItemTitle(val, idx) }
        .Parameters_Items__itemBriefDescription(if="{ parent.isPropertiesMode }") { parent.getBriefItemDescription(val) }
        .Parameters_Items__itemBriefOpenButton
          viron-icon-arrow-down
      .Parameters_Items__itemMoveUp(if="{ opts.val.length >= 2 }" onTap="{ handleMoveUpTap }")
        viron-icon-arrow-up
      .Parameters_Items__itemMoveDown(if="{ opts.val.length >= 2 }" onTap="{ handleMoveDownTap }")
        viron-icon-arrow-down

  script.
    import '../../../components/icons/viron-icon-arrow-down/index.tag';
    import '../../../components/icons/viron-icon-arrow-up/index.tag';
    import '../../../components/icons/viron-icon-plus/index.tag';
    import '../form/index.tag';
    import '../properties/index.tag';
    import script from './index';
    this.external(script);
