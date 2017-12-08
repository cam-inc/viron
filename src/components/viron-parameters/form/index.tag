viron-parameters-form.Parameters_Form
  .Parameters_Form__head(if="{ uiType !== 'checkbox' }")
    .Parameters_Form__title { title }
  .Parameters_Form__body
    .Parameters_Form__error(if="{ hasError }")
      viron-parameters-popover(theme="{ opts.theme }" message="{ errors[0] }")
    virtual(if="{ uiType === 'textinput' }")
      viron-textinput(val="{ opts.val }" theme="{ opts.theme }" isDisabled="{ opts.isdisabled }" isError="{ hasError }" onChange="{ handleTextinputChange }")
    virtual(if="{ uiType === 'textarea' }")
      viron-textarea(val="{ opts.val }" theme="{ opts.theme }" isDisabled="{ opts.isdisabled }" isError="{ hasError }" onChange="{ handleTextareaChange }")
    virtual(if="{ uiType === 'numberinput' }")
      viron-numberinput(val="{ opts.val }" theme="{ opts.theme }" isDisabled="{ opts.isdisabled }" isError="{ hasError }" onChange="{ handleNumberinputChange }")
    virtual(if="{ uiType === 'checkbox' }")
      viron-checkbox(isChecked="{ opts.val }" theme="{ opts.theme }" isDisabled="{ opts.isdisabled }" isError="{ hasError }" label="{ title }" onChange="{ handleCheckboxChange }")
    virtual(if="{ uiType === 'select' }")
      viron-select(options="{ getSelectOptions() }" theme="{ opts.theme }" isDisabled="{ opts.isdisabled }" isError="{ hasError }" onChange="{ handleSelectChange }")
    virtual(if="{ uiType === 'uploader' }")
      viron-uploader(accept="{ accept }" theme="{ opts.theme }" isDisabled="{ opts.isdisabled }" isError="{ hasError }" onChange="{ handleUploaderChange }")
    virtual(if="{ uiType === 'html' }")
      viron-html(val="{ opts.val }" theme="{ opts.theme }" isDisabled="{ opts.isdisabled }" isError="{ hasError }" onChange="{ handleHtmlChange }")
    virtual(if="{ uiType === 'pug' }")
      viron-pug(val="{ opts.val }" theme="{ opts.theme }" isDisabled="{ opts.isdisabled }" isError="{ hasError }" onChange="{ handlePugChange }")
    virtual(if="{ uiType === 'autocomplete' }")
      viron-autocomplete(val="{ opts.val }" theme="{ opts.theme }" isDisabled="{ opts.isdisabled }" isError="{ hasError }" config="{ autocompleteConfig }" onChange="{ handleAutocompleteChange }")
    virtual(if="{ uiType === 'wyswyg' }")
      viron-wyswyg(val="{ opts.val }" theme="{ opts.theme }" isDisabled="{ opts.isdisabled }" isError="{ hasError }" onChange="{ handleWyswygChange }")
    virtual(if="{ uiType === 'null' }")
      div TODO

  script.
    // TODO: 全てのフォーム動作確認。
    import '../../../components/viron-autocomplete/index.tag';
    import '../../../components/viron-checkbox/index.tag';
    import '../../../components/viron-html/index.tag';
    import '../../../components/viron-numberinput/index.tag';
    import '../../../components/viron-pug/index.tag';
    import '../../../components/viron-select/index.tag';
    import '../../../components/viron-textarea/index.tag';
    import '../../../components/viron-textinput/index.tag';
    import '../../../components/viron-uploader/index.tag';
    import '../../../components/viron-wyswyg/index.tag';
    import '../popover/index.tag';
    import script from './index';
    this.external(script);
