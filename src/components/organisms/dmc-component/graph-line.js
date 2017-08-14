import ObjectAssign from 'object-assign';
import chart from '../../../core/chart';

export default function() {
  this.on('mount', () => {
    new chart.Chart(ObjectAssign({
      type: 'line',
      guide: {
        interpolate: 'smooth'
      }
    }, this.opts.response)).renderTo(this.refs.canvas);
  });
}
