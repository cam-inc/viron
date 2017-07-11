dmc-operation-parameter-form.Operation__parameterForm
  virtual(if="{ uiType === 'input' }")
    dmc-textinput(text="{ opts.parametervalue }" onChange="{ handleInputChange }")
  virtual(if="{ uiType === 'checkbox' }")
    dmc-checkbox(isChecked="{ opts.parametervalue }" onChange="{ handleCheckboxChange }")
  virtual(if="{ uiType === 'select' }")
    dmc-select(isOpened="{ isOpened }" options="{ getSelectOptions() }" onChange="{ handleSelectChange }")
  virtual(if="{ uiType === 'uploader' }")
    dmc-uploader(accept="*" onFileChange="{ handleFileChange }")
  virtual(if="{ uiType === 'datepicker' }")
    dmc-datepicker(onDateChange="{ handleDateChange }")

  script.
    import '../../atoms/dmc-checkbox/index.tag';
    import '../../atoms/dmc-datepicker/index.tag';
    import '../../atoms/dmc-select/index.tag';
    import '../../atoms/dmc-textinput/index.tag';
    import '../../atoms/dmc-uploader/index.tag';
    import script from './parameter-form';
    this.external(script);
