dmc-parameter-schema.ParameterSchema(class="{ isInfoOpened ? 'ParameterSchema--infoOpened' : '' } { isValidateOpened ? 'ParameterSchema--validateOpened' : '' } { isBodyOpened ? 'ParameterSchema--bodyOpened' : '' }")
  .ParameterSchema__head
    .ParameterSchema__caption
      .ParameterSchema__bodyOpenShutButton(ref="touch" onTap="handleBodyOpenShutButtonTap")
        dmc-icon(type="right")
      .ParameterSchema__name(ref="touch" onTap="handleNameTap") { name }
      .ParameterSchema__line
      .ParameterSchema__validateOpenShutButton(if="{ !!getValidateErrors().length }" ref="touch" onTap="handleValidateOpenShutButtonTap")
        dmc-icon(type="exclamationCircleO")
      .ParameterSchema__addButton(if="{ isItemsMode }" ref="touch" onTap="handleAddButtonTap")
        dmc-icon(type="plusCircle")
      .ParameterSchema__removeButton(if="{ opts.isremovable }" ref="touch" onTap="handleRemoveButtonTap")
        dmc-icon(type="minusCircle")
      .ParameterSchema__infoOpenShutButton(ref="touch" onTap="handleInfoOpenShutButtonTap")
        dmc-icon(type="infoCirlceO")
    .ParameterSchema__info
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
    .ParameterSchema__validates(if="{ !!getValidateErrors().length }")
      virtual(each="{ err in getValidateErrors() }")
        .ParameterSchema__validate
          .ParameterSchema__validateIcon
            dmc-icon(type="exclamationCircleO")
          .ParameterSchema__validateMessage { err.message }
  .ParameterSchema__body
    virtual(if="{ isFormMode }")
      dmc-parameter-form(val="{ opts.val }" schemaObject="{ schemaObject }" onChange="{ handleFormChange }")
    virtual(if="{ isPropertiesMode }")
      dmc-parameter-schema(each="{ property, key in properties }" key="{ key }" val="{ parent.getPropertyValue(property, key) }" schemaObject="{ parent.getNormalizedSchemaObjectForProperty(property, key) }" onChange="{ parent.handlePropertyChange }")
    virtual(if="{ isItemsMode }")
      dmc-parameter-schema(no-reorder isRemovable="{ true }" each="{ val, idx in opts.val }" key="{ idx }" val="{ parent.getItemValue(idx) }" schemaObject="{ parent.getNormalizedSchemaObjectForItem(idx) }" onRemove="{ parent.handleItemsRemove }" onChange="{ parent.handleItemsChange }")

  script.
    import '../../atoms/dmc-icon/index.tag';
    import './form.tag';
    import script from './schema';
    this.external(script);
