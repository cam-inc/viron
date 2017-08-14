dmc-parameter-schema.ParameterSchema
  .ParameterSchema__head
    .ParameterSchema__caption
      .ParameterSchema__bodyOpenShutButton(class="{ isBodyOpened ? 'ParameterSchema__bodyOpenShutButton--active' : '' }" ref="touch" onTap="handleBodyOpenShutButtonTap")
        dmc-icon(type="right")
      .ParameterSchema__name(ref="touch" onTap="handleNameTap") { name }
      .ParameterSchema__line
      .ParameterSchema__validateOpenShutButton(if="{ !!getValidateErrors().length }" class="{ isValidateOpened ? '.ParameterSchema__validateOpenShutButton--active' : '' }" ref="touch" onTap="handleValidateOpenShutButtonTap")
        dmc-icon(type="exclamationCircleO")
      .ParameterSchema__addButton(if="{ isItemsMode }" ref="touch" onTap="handleAddButtonTap")
        dmc-icon(type="plusCircle")
      .ParameterSchema__removeButton(if="{ opts.isremovable }" ref="touch" onTap="handleRemoveButtonTap")
        dmc-icon(type="minusCircle")
      .ParameterSchema__infoOpenShutButton(class="{ isInfoOpened ? 'ParameterSchema__infoOpenShutButton--active' : '' }" ref="touch" onTap="handleInfoOpenShutButtonTap")
        dmc-icon(type="infoCirlceO")
  .ParameterSchema__body(if="{ isBodyOpened }")
    .ParameterSchema__info(if="{ isInfoOpened }")
      .ParameterSchema__description(if="{ !!description }") description: { description }
      .ParameterSchema__type type: { type }
      .ParameterSchema__enum(if="{ !!enum }") enum: { enum }
      .ParameterSchema__multipleOf(if="{ !!multipleOf }") multipleOf: { multipleOf }
      .ParameterSchema__maximum(if="{ !!maximum }") maximum: { maximum }
      .ParameterSchema__exclusiveMaximum(if="{ !!exclusiveMaximum }") exclusiveMaximum: { exclusiveMaximum }
      .ParameterSchema__minimum(if="{ !!minimum }") minimum: { minimum }
      .ParameterSchema__exclusiveMinimum(if="{ !!exclusiveMinimum }") exclusiveMinimum: { exclusiveMinimum }
      .ParameterSchema__maxLength(if="{ !!maxLength }") maxLength: { maxLength }
      .ParameterSchema__minLength(if="{ !!minLength }") minLength: { minLength }
      .ParameterSchema__pattern(if="{ !!pattern }") pattern: { pattern }
      .ParameterSchema__format(if="{ !!format }") format: { format }
      .ParameterSchema__example(if="{ !!example }") example: { example }
    .ParameterSchema__validates(if="{ isValidateOpened && !!getValidateErrors().length }")
      virtual(each="{ err in getValidateErrors() }")
        .ParameterSchema__validate
          .ParameterSchema__validateIcon
            dmc-icon(type="exclamationCircleO")
          .ParameterSchema__validateMessage { err.message }
    .ParameterSchema__content
      virtual(if="{ isFormMode }")
        dmc-parameter-form(val="{ opts.val }" schemaObject="{ schemaObject }" onChange="{ handleFormChange }")
      virtual(if="{ isPropertiesMode }")
        dmc-parameter-schema(each="{ property, key in properties }" key="{ key }" val="{ parent.getPropertyValue(property, key) }" schemaObject="{ parent.getNormalizedSchemaObjectForProperty(property, key) }" onChange="{ parent.handlePropertyChange }")
      virtual(if="{ isItemsMode && !!opts.val.length }")
        dmc-parameter-schema(no-reorder isRemovable="{ true }" each="{ val, idx in opts.val }" key="{ idx }" val="{ parent.getItemValue(idx) }" schemaObject="{ parent.getNormalizedSchemaObjectForItem(idx) }" onRemove="{ parent.handleItemsRemove }" onChange="{ parent.handleItemsChange }")
      virtual(if="{ isItemsMode && !opts.val.length }")
        .ParameterSchema__emptyItemsMessage まだ中身がありません。

  script.
    import '../../atoms/dmc-icon/index.tag';
    import './form.tag';
    import script from './schema';
    this.external(script);
