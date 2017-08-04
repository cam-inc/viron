import ObjectAssign from 'object-assign';
import chart from '../../../core/chart';

export default function() {
  this.on('mount', () => {
    new chart.Chart(ObjectAssign({
      type: 'horizontalBar'
    }, this.opts.response)).renderTo(this.refs.canvas);
  });
}
