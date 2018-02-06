import QRCode from 'qrcode';

export default function() {
  this.on('mount', () => {
    QRCode.toCanvas(this.refs.canvas, this.opts.data.value, {
      width: this.opts.data.size,
    }, error => {
      if (error) {
        console.error(error); // eslint-disable-line no-console
      }
    });
  });
}
