import ObjectAssign from 'object-assign';
import QRious from 'qrious'; // @see https://github.com/neocotic/qrious

export default function() {
  this.on('mount', () => {
    new QRious(ObjectAssign({}, this.opts.data, {
      element: this.refs.canvas
    }));
  });
}
