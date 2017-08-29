export default function() {
  this.qrcodeStyle = {
    // background: 'green',
    // backgroundAlpha: 0.8,
    // element: <Canvas>,
    // foreground: 'blue',
    // foregroundAlpha: 0.8,
    level: 'M',
    mime: 'image/png',
    // padding: 5,
    size: 200,
    value: `${document.location.origin}/?endpoint=${this.opts.url}`
  };
}
