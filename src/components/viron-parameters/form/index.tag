viron-parameters-form.Parameters_Form
  .Parameters_Form__head
    .Parameters_Form__title { title }
  .Parameters_Form__body
    virtual(if="{ uiType === 'textinput' }")
      viron-textinput(val="{ opts.val }" onChange="{ handleTextinputChange }")
    virtual(if="{ uiType === 'numberinput' }")
      viron-numberinput(val="{ opts.val }" onChange="{ handleNumberinputChange }")
    virtual(if="{ uiType === 'select' }")
      viron-select(options="{ getSelectOptions() }" onChange="{ handleSelectChange }")
    virtual(if="{ uiType === 'uploader' }")
      viron-uploader(accept="*" onChange="{ handleUploaderChange }")

  script.
    import '../../../components/viron-numberinput/index.tag';
    import '../../../components/viron-select/index.tag';
    import '../../../components/viron-textinput/index.tag';
    import '../../../components/viron-uploader/index.tag';
    import script from './index';
    this.external(script);
