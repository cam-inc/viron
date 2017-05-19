dmc-component-graph-line.ComponentGraphLine
  .ComponentGraphLine__canvas(ref="canvas")

  script.
    import ObjectAssign from 'object-assign';
    import chart from '../../core/chart';

    this.on('mount', () => {
      const rawData = this.opts.data.getRawValue();
      new chart.Chart(ObjectAssign({
        type: 'line',
        guide: {
          interpolate: 'smooth'
        }
      }, rawData)).renderTo(this.refs.canvas);
    });
