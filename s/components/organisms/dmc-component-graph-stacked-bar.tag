dmc-component-graph-stacked-bar.ComponentGraphStackedBar
  .ComponentGraphStackedBar__canvas(ref="canvas")

  script.
    import { forEach } from 'mout/array';
    import chart from '../../core/chart';

    const keys = [];
    forEach(this.opts.data.getValue('keys').getValue(), key => {
      keys.push(key.getValue());
    });
    const defData = [];
    forEach(this.opts.data.getValue('data').getValue(), (data, idx) => {
      defData[idx] = {};
      forEach(keys, (key, i) => {
        defData[idx][key] = data.getValue(i).getValue();
      });
    });

    this.on('mount', () => {
      new chart.Chart({
        type: 'stacked-bar',
        data: defData,
        guide: {
          x: { label: keys[0] },
          y: { label: keys[1] }
        },
        x: keys[0],
        y: keys[1]
      }).renderTo(this.refs.canvas);
    });
