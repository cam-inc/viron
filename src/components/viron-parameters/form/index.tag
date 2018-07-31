viron-parameters-form.Parameters_Form(class="{ 'Parameters_Form--preview': opts.ispreview }")
  .Parameters_Form__head(if="{ uiType !== 'checkbox' }")
    .Parameters_Form__title(class="{ 'Parameters_Form__title--required':isRequired }") { title }
    .Parameters_Form__description(if="{ !!description }") { description }
    .Parameters_Form__now(if="{ !opts.ispreview && uiType === 'timepicker' }" onTap="{ handleNowTap }") Now
    .Parameters_Form__today(if="{ !opts.ispreview && uiType === 'timepicker' }" onTap="{ handleTodayTap }") Today
  .Parameters_Form__error(if="{ isMobile && isFocus && hasError && !opts.ispreview}") { errors[0] }
  .Parameters_Form__body(ref="body" onTap="{ handleBodyTap }")
    virtual(if="{ uiType === 'textinput' }")
      viron-textinput(val="{ opts.val }" theme="{ opts.theme }" placeholder="{ placeholder }" isPreview="{ opts.ispreview }" isDisabled="{ isDisabled }" isError="{ hasError }" onSubmit="{ handleTextInputSubmit }" onChange="{ handleTextinputChange }" onFocus="{ handleFormFocus }" onBlur="{ handleFormBlur }")
    virtual(if="{ uiType === 'timepicker' }")
      viron-textinput(class="Parameters_Form__timepickerTextinput" val="{ getTimeOffsetValue(opts.val) }" theme="{ opts.theme }" placeholder="{ placeholder }" isPreview="{ opts.ispreview }" isDisabled="{ isDisabled }" isError="{ hasError }" onSubmit="{ handleTimepickerSubmit }" onChange="{ handleTimepickerChange }" onFocus="{ handleFormFocus }" onBlur="{ handleFormBlur }")
      .Parameters_Form__timepicker(if="{ !opts.ispreview }" onTap="{ handleTimepickerTap }")
        viron-icon-star
    virtual(if="{ uiType === 'textarea' }")
      viron-textarea(val="{ opts.val }" theme="{ opts.theme }" placeholder="{ placeholder }" isPreview="{ opts.ispreview }" isDisabled="{ isDisabled }" isError="{ hasError }" onChange="{ handleTextareaChange }" onFocus="{ handleFormFocus }" onBlur="{ handleFormBlur }")
    virtual(if="{ uiType === 'numberinput' }")
      viron-numberinput(val="{ opts.val }" theme="{ opts.theme }" placeholder="{ placeholder }" isPreview="{ opts.ispreview }" isDisabled="{ isDisabled }" isError="{ hasError }" onSubmit="{ handleNumberInputSubmit }" onChange="{ handleNumberinputChange }" onFocus="{ handleFormFocus }" onBlur="{ handleFormBlur }")
    virtual(if="{ uiType === 'checkbox' }")
      viron-checkbox(isChecked="{ opts.val }" theme="{ opts.theme }" isPreview="{ opts.ispreview }" isDisabled="{ isDisabled }" isError="{ hasError }" label="{ title }" description="{ description }" onChange="{ handleCheckboxChange }")
    virtual(if="{ uiType === 'select' }")
      viron-select(options="{ getSelectOptions() }" theme="{ opts.theme }" isPreview="{ opts.ispreview }" isDisabled="{ isDisabled }" isError="{ hasError }" onChange="{ handleSelectChange }")
    virtual(if="{ uiType === 'uploader' }")
      viron-uploader(accept="{ accept }" initialBlobUrl="{ opts.val }" theme="{ opts.theme }" isPreview="{ opts.ispreview }" isDisabled="{ isDisabled }" isError="{ hasError }" onChange="{ handleUploaderChange }")
    virtual(if="{ uiType === 'base64' }")
      viron-base64(val="{ opts.val }" theme="{ opts.theme }" isPreview="{ opts.ispreview }" mimeType="{ mimeType }" onChange="{ handleBase64Change }")
    virtual(if="{ uiType === 'html' }")
      viron-html(val="{ opts.val }" theme="{ opts.theme }" isPreview="{ opts.ispreview }" isDisabled="{ isDisabled }" isError="{ hasError }" onChange="{ handleHtmlChange }" onFocus="{ handleFormFocus }" onBlur="{ handleFormBlur }")
    virtual(if="{ uiType === 'pug' }")
      viron-pug(val="{ opts.val }" theme="{ opts.theme }" isPreview="{ opts.ispreview }" isDisabled="{ isDisabled }" isError="{ hasError }" onChange="{ handlePugChange }" onFocus="{ handleFormFocus }" onBlur="{ handleFormBlur }")
    virtual(if="{ uiType === 'autocomplete' }")
      viron-autocomplete(val="{ opts.val }" theme="{ opts.theme }" isPreview="{ opts.ispreview }" isDisabled="{ isDisabled }" isError="{ hasError }" config="{ autocompleteConfig }" onSubmit="{ handleAutocompleteSubmit }" onChange="{ handleAutocompleteChange }" onFocus="{ handleFormFocus }" onBlur="{ handleFormBlur }")
    virtual(if="{ uiType === 'wyswyg' }")
      viron-wyswyg(val="{ opts.val }" theme="{ opts.theme }" explorer="{ explorerConfig }" isPreview="{ opts.ispreview }" isDisabled="{ isDisabled }" isError="{ hasError }" onChange="{ handleWyswygChange }")
    virtual(if="{ uiType === 'image' }")
      viron-image(val="{ opts.val }" theme="{ opts.theme }" isPreview="{ opts.ispreview || isDisabled }")
    virtual(if="{ uiType === 'null' }")
      div NULL

  script.
    import '../../../components/icons/viron-icon-star/index.tag';
    import '../../../components/viron-autocomplete/index.tag';
    import '../../../components/viron-base64/index.tag';
    import '../../../components/viron-checkbox/index.tag';
    import '../../../components/viron-html/index.tag';
    import '../../../components/viron-image/index.tag';
    import '../../../components/viron-numberinput/index.tag';
    import '../../../components/viron-pug/index.tag';
    import '../../../components/viron-select/index.tag';
    import '../../../components/viron-textarea/index.tag';
    import '../../../components/viron-textinput/index.tag';
    import '../../../components/viron-uploader/index.tag';
    import '../../../components/viron-wyswyg/index.tag';
    import script from './index';
    this.external(script);
