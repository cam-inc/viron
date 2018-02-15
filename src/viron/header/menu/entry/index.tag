viron-application-header-menu-entry.Application_Header_Menu_Entry
  .Application_Header_Menu_Entry__title 管理画面を追加
  .Application_Header_Menu_Entry__message(if="{ !!errorMessage }") { errorMessage }
  .Application_Header_Menu_Entry__selfSignedCertificate(if="{ !!isLikelyToBeSelfSignedCertificate }" onTap="{ handleSelfSignedCertificateButtonTap }") Self-Signed Certificate?
  .Application_Header_Menu_Entry__inputs
    viron-textinput(placeholder="URLの入力" val="{ endpointURL }" onSubmit="{ handleFormSubmit }" onChange="{ handleEndpointURLChange }")
  .Application_Header_Menu_Entry__control
    viron-button(label="追加" onSelect="{ handleAddButtonSelect }")

  script.
    import '../../../../components/viron-button/index.tag';
    import '../../../../components/viron-textinput/index.tag';
    import script from './index';
    this.external(script);
