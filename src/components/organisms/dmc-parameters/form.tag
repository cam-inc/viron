dmc-parameter-form.ParameterForm(class="{ isInfoOpened ? 'ParameterForm--infoOpened' : '' } { isBodyOpened ? 'ParameterForm--bodyOpened' : '' }")
  .ParameterForm__head
    .ParameterForm__caption
      .ParameterForm__bodyOpenShutButton(ref="touch" onTap="handleBodyOpenShutButtonTap")
        dmc-icon(type="right")
      .ParameterForm__name(ref="touch" onTap="handleNameTap") { name }
      .ParameterForm__line
      .ParameterForm__required(if="{ required }") required
      .ParameterForm__infoOpenShutButton(ref="touch" onTap="handleInfoOpenShutButtonTap")
        dmc-icon(type="infoCirlceO")
    .ParameterForm__info
      .ParameterForm__description(if="{ !!description }") description: { description }
      .ParameterForm__type type: { type }
  .ParameterForm__body
    virtual(if="{ uiType === 'textinput' }")
      dmc-textinput(text="{ opts.val }" onChange="{ handleTextinputChange }")
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
    import '../../atoms/dmc-select/index.tag';
    import '../../atoms/dmc-textinput/index.tag';
    import '../../atoms/dmc-uploader/index.tag';
    import script from './form';
    this.external(script);
