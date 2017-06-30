import ObjectAssign from 'object-assign';
import chart from '../../../core/chart';

export default function() {
  this.on('mount', () => {
    const rawData = this.opts.data.getRawValue();
    new chart.Chart(ObjectAssign({
      type: 'bar'
    }, rawData)).renderTo(this.refs.canvas);
  });
}
