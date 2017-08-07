dmc-parameter-form.ParameterForm
  virtual(if="{ uiType === 'textinput' }")
    dmc-textinput(text="{ opts.val || _default }" onChange="{ handleTextinputChange }")
  virtual(if="{ uiType === 'checkbox' }")
  virtual(if="{ uiType === 'select' }")
  virtual(if="{ uiType === 'uploader' }")

  script.
    import '../../atoms/dmc-textinput/index.tag';
    import script from './form';
    this.external(script);
