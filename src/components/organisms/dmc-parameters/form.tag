dmc-parameter-form
  .ParameterForm__body
    virtual(if="{ uiType === 'textinput' }")
      dmc-textinput(text="{ opts.val }" onChange="{ handleTextinputChange }")
    virtual(if="{ uiType === 'textarea' }")
      dmc-textarea(text="{ opts.val }" onChange="{ handleTextareaChange }")
    virtual(if="{ uiType === 'numberinput' }")
      dmc-numberinput(number="{ opts.val }" onChange="{ handleNumberinputChange }")
    virtual(if="{ uiType === 'checkbox' }")
      dmc-checkbox(isChecked="{ opts.val }" onChange="{ handleCheckboxChange }")
    virtual(if="{ uiType === 'select' }")
      dmc-select(options="{ getSelectOptions() }" onChange="{ handleSelectChange }")
    virtual(if="{ uiType === 'uploader' }")
      dmc-uploader(accept="*" onFileChange="{ handleUploaderFileChange }")
    virtual(if="{ uiType === 'wyswyg' }")
      dmc-wyswyg(blotOptions="{ blotOptions }" initialInnerHtml="{ opts.val }" onTextChange="{ handleWyswygChange }")
    virtual(if="{ uiType === 'null' }")
      div TODO: null

  script.
    import '../../atoms/dmc-checkbox/index.tag';
    import '../../atoms/dmc-numberinput/index.tag';
    import '../../atoms/dmc-select/index.tag';
    import '../../atoms/dmc-textarea/index.tag';
    import '../../atoms/dmc-textinput/index.tag';
    import '../../atoms/dmc-uploader/index.tag';
    import '../../atoms/dmc-wyswyg/index.tag';
    import script from './form';
    this.external(script);
