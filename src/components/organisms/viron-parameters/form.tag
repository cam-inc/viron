viron-parameter-form
  .ParameterForm__body
    virtual(if="{ uiType === 'textinput' }")
      viron-textinput(text="{ opts.val }" isDisabled="{ isDisabled }" onChange="{ handleTextinputChange }")
    virtual(if="{ uiType === 'textarea' }")
      viron-textarea(text="{ opts.val }" isDisabled="{ isDisabled }" onChange="{ handleTextareaChange }")
    virtual(if="{ uiType === 'numberinput' }")
      viron-numberinput(number="{ opts.val }" isDisabled="{ isDisabled }" onChange="{ handleNumberinputChange }")
    virtual(if="{ uiType === 'checkbox' }")
      viron-checkbox(isChecked="{ opts.val }" isDisabled="{ isDisabled }" onChange="{ handleCheckboxChange }")
    virtual(if="{ uiType === 'select' }")
      viron-select(options="{ getSelectOptions() }" isDisabled="{ isDisabled }" onChange="{ handleSelectChange }")
    virtual(if="{ uiType === 'uploader' }")
      viron-uploader(accept="*" isDisabled="{ isDisabled }" onFileChange="{ handleUploaderFileChange }")
    virtual(if="{ uiType === 'wyswyg' }")
      viron-wyswyg(blotOptions="{ blotOptions }" initialInnerHtml="{ opts.val }" isDisabled="{ isDisabled }" onTextChange="{ handleWyswygChange }")
    virtual(if="{ uiType === 'pug' }")
      viron-pug(text="{ opts.val }" isDisabled="{ isDisabled }" onChange="{ handlePugChange }")
    virtual(if="{ uiType === 'html' }")
      viron-html(text="{ opts.val }" isDisabled="{ isDisabled }" onChange="{ handleHtmlChange }")
    virtual(if="{ uiType === 'autocomplete' }")
      viron-autocomplete(val="{ opts.val }" config="{ autocompleteConfig }" onChange="{ handleAutocompleteChange }")
    virtual(if="{ uiType === 'null' }")
      div null

  script.
    import '../../atoms/viron-autocomplete/index.tag';
    import '../../atoms/viron-checkbox/index.tag';
    import '../../atoms/viron-html/index.tag';
    import '../../atoms/viron-numberinput/index.tag';
    import '../../atoms/viron-pug/index.tag';
    import '../../atoms/viron-select/index.tag';
    import '../../atoms/viron-textarea/index.tag';
    import '../../atoms/viron-textinput/index.tag';
    import '../../atoms/viron-uploader/index.tag';
    import '../../atoms/viron-wyswyg/index.tag';
    import script from './form';
    this.external(script);
