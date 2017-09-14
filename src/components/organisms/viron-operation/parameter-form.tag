viron-operation-parameter-form.Operation__parameterForm
  virtual(if="{ uiType === 'input' }")
    viron-textinput(text="{ opts.parametervalue }" onChange="{ handleInputChange }")
  virtual(if="{ uiType === 'checkbox' }")
    viron-checkbox(isChecked="{ opts.parametervalue }" onChange="{ handleCheckboxChange }")
  virtual(if="{ uiType === 'select' }")
    viron-select(isOpened="{ isOpened }" options="{ getSelectOptions() }" onChange="{ handleSelectChange }")
  virtual(if="{ uiType === 'uploader' }")
    viron-uploader(accept="*" onFileChange="{ handleFileChange }")
  // TODO: datepicker表示
  //virtual(if="{ uiType === 'datepicker' }")
    //viron-datepicker(onDateChange="{ handleDateChange }")

  script.
    import '../../atoms/viron-checkbox/index.tag';
    import '../../atoms/viron-select/index.tag';
    import '../../atoms/viron-textinput/index.tag';
    import '../../atoms/viron-uploader/index.tag';
    import script from './parameter-form';
    this.external(script);
