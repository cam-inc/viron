dmc-parameter-form.ParameterForm
  virtual(if="{ uiType === 'textinput' }")
    dmc-textinput(text="{ opts.val }" onChange="{ handleTextinputChange }")
  virtual(if="{ uiType === 'checkbox' }")
  virtual(if="{ uiType === 'select' }")
  virtual(if="{ uiType === 'uploader' }")
    dmc-uploader(accept="*" onFileChange="{ handleUploaderFileChange }")
  virtual(if="{ uiType === 'null' }")
    div TODO: null

  script.
    import '../../atoms/dmc-textinput/index.tag';
    import '../../atoms/dmc-uploader/index.tag';
    import script from './form';
    this.external(script);
