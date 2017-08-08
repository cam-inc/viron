dmc-endpoint-qrcode.EndpointsPage__qrcode
  dmc-qrcode(data="{qrcodeStyle}")
  dmc-button(type="secondary" onPat="{ handleCancelButtonPat }" label="閉じる")

  script.
    this.qrcodeStyle = {
      // background: 'green',
      // backgroundAlpha: 0.8,
      // element: <Canvas>,
      // foreground: 'blue',
      // foregroundAlpha: 0.8,
      level: 'H',
      mime: "image/png",
      // padding: 5,
      size: 120,
      value: `${document.location.origin}/?endpoint=${this.opts.url}`,
    }
    import '../../atoms/dmc-button/index.tag';
    import '../../atoms/dmc-qrcode/index.tag';
    import script from './qrcode';
    this.external(script);
