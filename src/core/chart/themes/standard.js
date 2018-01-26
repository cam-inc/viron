export default {
  chart: {
    spacing: 8,
    style: {
      fontFamily: '"Noto Sans", "Noto Sans CJK JP", "NotoSansCJKjp-Jxck", sans-serif'
    }
  },
  colors: ['#627EDF', '#C4BB6D', '#CBCFD4', '#588988', '#9FC8C1', '#E69EA2', '#828282'],
  legend: {
    itemStyle: {
      color: '#484848',
      fontWeight: 'normal'
    },
    margin: 8,
    padding: 0
  },
  plotOptions: {
    // 全てのchartタイプ共通の設定。
    series: {
      borderWidth: 0,
      fillOpacity: 0.25,
      marker: {
        fillColor: 'white',
        lineWidth: 2,
        lineColor: null // inherit from series
      }
    },
    bullet: {
      borderWidth: 0
    }
  },
  tooltip: {
    padding: 16,
    backgroundColor: 'rgb(72,72,72)',
    borderRadius: 6,
    borderWidth: 0,
    style: {
      color: 'white'
    }
  },
  xAxis: {
    gridLineWidth: 0
  },
  yAxis: {
    gridLineColor: '#EFEFEF',
    gridLineWidth: 1,
    lineWidth: 0
  }
};
