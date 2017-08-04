import ObjectAssign from 'object-assign';
import chart from '../../../core/chart';

export default function() {
  this.on('mount', () => {
    new chart.Chart(ObjectAssign({
      type: 'bar'
    }, this.opts.response)).renderTo(this.refs.canvas);
  });
}
