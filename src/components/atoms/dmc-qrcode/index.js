import QRious from 'qrious' // @see https://github.com/neocotic/qrious
import ObjectAssign from 'object-assign'

export default function() {
  this.on('mount', function() {
    const qrcode = new QRious(ObjectAssign({}, this.opts.data));
    this.refs.qrcode.src = qrcode.toDataURL();
  });

}
