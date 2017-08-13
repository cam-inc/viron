dmc-parameter-form.ParameterForm(class="{ isInfoOpened ? 'ParameterForm--infoOpened' : '' } { isValidateOpened ? 'ParameterForm--validateOpened' : '' } { isBodyOpened ? 'ParameterForm--bodyOpened' : '' }")
  .ParameterForm__head
    .ParameterForm__caption
      .ParameterForm__bodyOpenShutButton(ref="touch" onTap="handleBodyOpenShutButtonTap")
        dmc-icon(type="right")
      .ParameterForm__name(ref="touch" onTap="handleNameTap") { name }
      .ParameterForm__line
      .ParameterForm__required(if="{ required }") required
      .ParameterForm__validateOpenShutButton(if="{ !!getValidateErrors().length }" ref="touch" onTap="handleValidateOpenShutButtonTap")
        dmc-icon(type="exclamationCircleO")
      .ParameterForm__infoOpenShutButton(ref="touch" onTap="handleInfoOpenShutButtonTap")
        dmc-icon(type="infoCirlceO")
    .ParameterForm__info
      .ParameterForm__description(if="{ !!description }") description: { description }
      .ParameterForm__type type: { type }
      .ParameterForm__example(if="{ !!example }") example: { example }
    .ParameterForm__validates(if="{ !!getValidateErrors().length }")
      virtual(each="{ err in getValidateErrors() }")
        .ParameterForm__validate
          .ParameterForm__validateIcon
            dmc-icon(type="exclamationCircleO")
          .ParameterForm__validateMessage { err.message }
  .ParameterForm__body
    virtual(if="{ uiType === 'textinput' }")
      dmc-textinput(text="{ opts.val }" onChange="{ handleTextinputChange }")
    virtual(if="{ uiType === 'numberinput' }")
      dmc-numberinput(number="{ opts.val }" onChange="{ handleNumberinputChange }")
    virtual(if="{ uiType === 'checkbox' }")
      dmc-checkbox(isChecked="{ opts.val }" onChange="{ handleCheckboxChange }")
    virtual(if="{ uiType === 'select' }")
      dmc-select(options="{ getSelectOptions() }" onChange="{ handleSelectChange }")
    virtual(if="{ uiType === 'uploader' }")
      dmc-uploader(accept="*" onFileChange="{ handleUploaderFileChange }")
    virtual(if="{ uiType === 'null' }")
      div TODO: null

  script.
    import '../../atoms/dmc-checkbox/index.tag';
    import '../../atoms/dmc-numberinput/index.tag';
    import '../../atoms/dmc-select/index.tag';
    import '../../atoms/dmc-textinput/index.tag';
    import '../../atoms/dmc-uploader/index.tag';
    import script from './form';
    this.external(script);
