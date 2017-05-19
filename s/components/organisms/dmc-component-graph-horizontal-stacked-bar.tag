dmc-component-graph-horizontal-stacked-bar.ComponentGraphHorizontalStackedBar
  .ComponentGraphHorizontalStackedBar__canvas(ref="canvas")

  script.
    import ObjectAssign from 'object-assign';
    import chart from '../../core/chart';

    this.on('mount', () => {
      const rawData = this.opts.data.getRawValue();
      new chart.Chart(ObjectAssign({
        type: 'horizontal-stacked-bar'
      }, rawData)).renderTo(this.refs.canvas);
    });
