import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import annotations from 'highcharts/modules/annotations';
import boost from 'highcharts/modules/boost';
import bullet from 'highcharts/modules/bullet';
import drilldown from 'highcharts/modules/drilldown';
import exporting from 'highcharts/modules/exporting';
import funnel from 'highcharts/modules/funnel';
import heatmap from 'highcharts/modules/heatmap';
import histogramBellcurve from 'highcharts/modules/histogram-bellcurve';
import offlineExporting from 'highcharts/modules/offline-exporting';
import pareto from 'highcharts/modules/pareto';
import sankey from 'highcharts/modules/sankey';
import seriesLabel from 'highcharts/modules/series-label';
import solidGauge from 'highcharts/modules/solid-gauge';
import streamgraph from 'highcharts/modules/streamgraph';
import sunburst from 'highcharts/modules/sunburst';
import tilemap from 'highcharts/modules/tilemap';
import treemap from 'highcharts/modules/treemap';
import variablePie from 'highcharts/modules/variable-pie';
import variwide from 'highcharts/modules/variwide';
import vector from 'highcharts/modules/vector';
import windbarb from 'highcharts/modules/windbarb';
import wordcloud from 'highcharts/modules/wordcloud';
import xrange from 'highcharts/modules/xrange';
import themes from './themes';

themes.applyTheme('white');

HighchartsMore(Highcharts);
annotations(Highcharts);
boost(Highcharts);
bullet(Highcharts);
drilldown(Highcharts);
exporting(Highcharts);
funnel(Highcharts);
heatmap(Highcharts);
histogramBellcurve(Highcharts);
offlineExporting(Highcharts);
pareto(Highcharts);
sankey(Highcharts);
seriesLabel(Highcharts);
solidGauge(Highcharts);
streamgraph(Highcharts);
sunburst(Highcharts);
tilemap(Highcharts);
treemap(Highcharts);
variablePie(Highcharts);
variwide(Highcharts);
vector(Highcharts);
windbarb(Highcharts);
wordcloud(Highcharts);
xrange(Highcharts);

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
  exporting: { enabled: false },
  legend: {
    enabled: true,
    navigation: {
      enabled: true
    }
  },
  plotOptions: {
    // 全てのchartタイプ共通の設定。
    series: {
      animation: { duration: 300 },
      boostThreshold: 2000,
      cursor: 'pointer',
      label: { enabled: false }
    },
    heatmap: {
      dataLabels: { enabled: true }
    }
  },
  tooltip: {
    crosshairs: true,
    enabled: true
  },
  xAxis: {
    title: null,
    labels: {
      style: { fontSize: '8px' }
    }
  },
  yAxis: {
    title: null,
    labels: {
      style: { fontSize: '8px' }
    }
  }
});

export default Highcharts;
