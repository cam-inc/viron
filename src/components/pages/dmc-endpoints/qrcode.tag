dmc-endpoint-qrcode.EndpointsPage__qrcode
  .EndpointsPage__qrcodeMessage
    | モバイル端末にエンドポイントを追加できます。
    br
    | お好きなQRコードリーダーで読み込んで下さい。
  .EndpointsPage__qrcodeContent
    dmc-qrcode(data="{ data }")

  script.
    import '../../atoms/dmc-qrcode/index.tag';
    import script from './qrcode';
    this.external(script);
