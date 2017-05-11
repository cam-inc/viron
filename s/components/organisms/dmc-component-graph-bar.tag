dmc-component-graph-bar.ComponentGraphBar
  .ComponentGraphBar__canvas(ref="canvas")

  script.
    import { forEach } from 'mout/array';
    import chart from '../../core/chart';

    const keys = [];
    forEach(this.opts.data.keys, key => {
      keys.push(key.get());
    });
    const defData = [];
    forEach(this.opts.data.data, (data, idx) => {
      defData[idx] = {};
      forEach(keys, (key, i) => {
        defData[idx][key] = data[i].get();
      });
    });

    this.barChart = null;

    this.on('mount', () => {
      this.barChart = new chart.Chart({
        type: 'bar',
        data: defData,
        guide: {
          x: { label: keys[0] },
          y: { label: keys[1] }
        },
        x: keys[0],
        y: keys[1]
      }).renderTo(this.refs.canvas);
    });

    this.on('unmount', () => {
      // TODO: ここに処理が来ない。。why...
      // TODO: dispose chart.
    });
