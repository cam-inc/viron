dmc-component-graph-horizontal-bar.ComponentGraphHorizontalBar
  .ComponentGraphHorizontalBar__canvas(ref="canvas")

  script.
    import ObjectAssign from 'object-assign';
    import chart from '../../core/chart';

    this.on('mount', () => {
      const rawData = this.opts.data.getRawValue();
      new chart.Chart(ObjectAssign({
        type: 'horizontalBar'
      }, rawData)).renderTo(this.refs.canvas);
    });
