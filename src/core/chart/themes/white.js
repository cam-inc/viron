export default {
  chart: {
    backgroundColor: '#FFFFFF',
    spacing: 8,
    style: {
      fontFamily: 'NotoSansCJKjp-Jxck serif'
    }
  },
  colors: ['#C092F5', '#61C8FF', '#7CD6AB', '#FFC96B', '#F57177', '#CBCFD4', '#484848'],
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
      marker: {
        fillColor: 'white',
        lineWidth: 2,
        lineColor: null // inherit from series
      }
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
