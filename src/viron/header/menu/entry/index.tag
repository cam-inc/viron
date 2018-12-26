viron-application-header-menu-entry.Application_Header_Menu_Entry
  .Application_Header_Menu_Entry__title { i18n('vrn.header.menu.entry.title') }
  .Application_Header_Menu_Entry__message(if="{ !!errorMessage }") { errorMessage }
  .Application_Header_Menu_Entry__selfSignedCertificate(if="{ !!isLikelyToBeSelfSignedCertificate }" onTap="{ handleSelfSignedCertificateButtonTap }") Self-Signed Certificate?
  .Application_Header_Menu_Entry__inputs
    viron-textinput(placeholder="{ i18n('vrn.header.menu.entry.placeholder') }" val="{ endpointURL }" onSubmit="{ handleFormSubmit }" onChange="{ handleEndpointURLChange }")
  .Application_Header_Menu_Entry__control
    viron-button(label="{ i18n('vrn.header.menu.entry.button') }" onSelect="{ handleAddButtonSelect }")

  script.
    import '../../../../components/viron-button/index.tag';
    import '../../../../components/viron-textinput/index.tag';
    import script from './index';
    this.external(script);
