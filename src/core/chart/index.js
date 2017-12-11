import Highcharts from 'highcharts';
import annotations from 'highcharts/modules/annotations';
import boost from 'highcharts/modules/boost';
import drilldown from 'highcharts/modules/drilldown';
import exporting from 'highcharts/modules/exporting';
import offlineExporting from 'highcharts/modules/offline-exporting';
import seriesLabel from 'highcharts/modules/series-label';
import themes from './themes';

themes.applyTheme('white');

annotations(Highcharts);
boost(Highcharts);
drilldown(Highcharts);
exporting(Highcharts);
offlineExporting(Highcharts);
seriesLabel(Highcharts);

// 全チャート共通の設定。
Highcharts.setOptions({
  // タイトルは常に非表示にする。
  title: { text: null },
  subtitle: { text: null },
  boost: {
    allowForce: false
  },
  chart: {
    defaultSeriesType: 'bar',
    zoomType: 'x'
  },
  credits: { enabled: false },
  exporting: {
    // TODO
  },
  legend: {
    enabled: true,
    navigation: {
      enabled: true
    }
  },
  plotOptions: {
    // 全てのchartタイプ共通の設定。
    series: {
      allowPointSelect: true,
      animation: { duration: 300 },
      dataLabels: {
        enabled: true
      },
      boostThreshold: 2000,
      cursor: 'pointer',
      label: { enabled: true },
      marker: { enabled: true }
    }
  },
  tooltip: {
    crosshairs: true,
    enabled: true
  }
});

export default Highcharts;

const sample01 = {
  chart: { type: 'column' },
  series: [
    { data: [0,10,20,30,40,50,60] },
    { data: [0,1,2,3,4,5,6], dashStyle: 'longdash' },
  ]
};
const sample02 = {};

export {
  sample01,
  sample02
};
