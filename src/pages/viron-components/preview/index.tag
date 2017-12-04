viron-components-page-preview.ComponentsPage_Preview
  .ComponentsPage_Preview__head
    .ComponentsPage_Preview__title プレビュー
    .ComponentsPage_Preview__operationsButton(if="{ !!this.operations.length }" onTap="{ handleOperationsButtonTap }")
      viron-icon-setting
    .ComponentsPage_Preview__backButton(onTap="{ handleBackButtonTap }")
      viron-icon-arrow-left
  .ComponentsPage_Preview__body
    viron-parameters(val="{ val }" parameterObjects="{ parameterObjects }")
  .ComponentsPage_Preview__tail
    .ComponentsPage_Preview__prevButton(class="{ 'ComponentsPage_Preview__prevButton--disabled': isPrevButtonDisabled }" onTap="{ handlePrevButtonTap }")
      viron-icon-arrow-up
    .ComponentsPage_Preview__nextButton(class="{ 'ComponentsPage_Preview__prevButton--disabled': isNextButtonDisabled }" onTap="{ handleNextButtonTap }")
      viron-icon-arrow-down

  script.
    import '../../../components/icons/viron-icon-arrow-left/index.tag';
    import '../../../components/icons/viron-icon-setting/index.tag';
    import '../../../components/viron-parameters/index.tag';
    import script from './index';
    this.external(script);
