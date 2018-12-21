viron-endpoints-page-endpoint-menu-qrcode.EndpointsPage_Endpoint_Menu_QRCode
  .EndpointsPage_Endpoint_Menu_QRCode__title { i18n('qrcode') }
  .EndpointsPage_Endpoint_Menu_QRCode__message
    | { i18n('qrcode_info1') }
    br
    | { i18n('qrcode_info2') }
  .EndpointsPage_Endpoint_Menu_QRCode__canvas
    viron-qrcode(data="{ data }")

  script.
    import '../../../../../components/viron-qrcode/index.tag';
    import script from './index';
    this.external(script);
