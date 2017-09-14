viron-parameter-schema.ParameterSchema(class="{ 'ParameterSchema--disabled' : isDisabled }")
  .ParameterSchema__head
    .ParameterSchema__caption
      .ParameterSchema__bodyOpenShutButton(class="{ isBodyOpened ? 'ParameterSchema__bodyOpenShutButton--active' : '' }" ref="touch" onTap="handleBodyOpenShutButtonTap")
        viron-icon(type="right")
      .ParameterSchema__name(ref="touch" onTap="handleNameTap") { name }
      .ParameterSchema__line
      .ParameterSchema__selfRequired(if="{ selfRequired }") required
      .ParameterSchema__validateOpenShutButton(if="{ !!getValidateErrors().length }" class="{ isValidateOpened ? '.ParameterSchema__validateOpenShutButton--active' : '' }" ref="touch" onTap="handleValidateOpenShutButtonTap")
        viron-icon(type="exclamationCircleO")
      .ParameterSchema__addButton(if="{ isItemsMode }" ref="touch" onTap="handleAddButtonTap")
        viron-icon(type="plusCircle")
      .ParameterSchema__removeButton(if="{ opts.isremovable }" ref="touch" onTap="handleRemoveButtonTap")
        viron-icon(type="minusCircle")
      .ParameterSchema__previewOpenShutButton(if="{ opts.val !== undefined }" class="{ isPreviewOpened ? 'ParameterSchema__previewOpenShutButton--active' : '' }" ref="touch" onTap="handlePreviewOpenShutButtonTap")
        viron-icon(type="filetext")
      .ParameterSchema__infoOpenShutButton(class="{ isInfoOpened ? 'ParameterSchema__infoOpenShutButton--active' : '' }" ref="touch" onTap="handleInfoOpenShutButtonTap")
        viron-icon(type="infoCirlceO")
  .ParameterSchema__body(if="{ isBodyOpened }")
    .ParameterSchema__validates(if="{ isValidateOpened && !!getValidateErrors().length }")
      virtual(each="{ err in getValidateErrors() }")
        .ParameterSchema__validate
          .ParameterSchema__validateIcon
            viron-icon(type="exclamationCircleO")
          .ParameterSchema__validateMessage { err.message }
    .ParameterSchema__info(if="{ isInfoOpened }")
      virtual(each="{ info in infos }")
        div(class="ParameterSchema__{ info.key }") { info.key }: { info.value }
    .ParameterSchema__preview(if="{ isPreviewOpened && opts.val !== undefined }")
      viron-prettyprint(data="{ opts.val }")
    .ParameterSchema__content
      virtual(if="{ isFormMode }")
        viron-parameter-form(val="{ opts.val }" schemaObject="{ schemaObject }" additionalInfo="{ opts.additionalinfo }" onChange="{ handleFormChange }")
      virtual(if="{ isPropertiesMode }")
        viron-parameter-schema(each="{ property, propKey in properties }" propKey="{ propKey }" val="{ parent.getPropertyValue(property, propKey) }" schemaObject="{ parent.getNormalizedSchemaObjectForProperty(property, propKey) }" additionalInfo="{ parent.opts.additionalinfo }" onChange="{ parent.handlePropertyChange }")
      virtual(if="{ isItemsMode && !!opts.val.length }")
        viron-parameter-schema(no-reorder isRemovable="{ true }" each="{ val, idx in opts.val }" propKey="{ idx }" val="{ parent.getItemValue(idx) }" schemaObject="{ parent.getNormalizedSchemaObjectForItem(idx) }" additionalInfo="{ parent.opts.additionalinfo }" onRemove="{ parent.handleItemsRemove }" onChange="{ parent.handleItemsChange }")
      virtual(if="{ isItemsMode && !opts.val.length }")
        .ParameterSchema__emptyItemsMessage まだ中身がありません。

  script.
    import '../../atoms/viron-icon/index.tag';
    import './form.tag';
    import script from './schema';
    this.external(script);
