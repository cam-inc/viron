viron-endpoints-page-endpoint-menu-qrcode.EndpointsPage_Endpoint_Menu_QRCode
  .EndpointsPage_Endpoint_Menu_QRCode__title QRコード
  .EndpointsPage_Endpoint_Menu_QRCode__message
    | モバイル端末にエンドポイントを追加できます。
    br
    | お好きなQRコードリーダーで読み込んで下さい。
  .EndpointsPage_Endpoint_Menu_QRCode__canvas
    viron-qrcode(data="{ data }")

  script.
    import '../../../../../components/viron-qrcode/index.tag';
    import script from './index';
    this.external(script);
