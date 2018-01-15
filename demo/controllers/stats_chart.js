/**
 * GET: /stats/chart/area
 */
const area = (req, res) => {
  res.json({
    chart: {
      type: 'area',
    },
    xAxis: {
      title: {
        text: '日時',
      },
      type: 'category',
    },
    yAxis: {
      title: {
        text: '会員数',
      },
    },
    series: [{
      name: 'siteX',
      data: [
        ['2017-12-15', 235], ['2017-12-16', 123], ['2017-12-17', 257], ['2017-12-18', 263], ['2017-12-19', 270], ['2017-12-20', 1070]
      ],
    }, {
      name: 'siteY',
      data: [
        ['2017-12-15', 50], ['2017-12-16', 10], ['2017-12-17', 145], ['2017-12-18', 350], ['2017-12-19', 90], ['2017-12-20', 910]
      ],
    }, {
      name: 'siteZ',
      data: [
        ['2017-12-15', 123], ['2017-12-16', 45], ['2017-12-17', 100], ['2017-12-18', 250], ['2017-12-19', 50], ['2017-12-20', 50]
      ],
    }],
  });
};

/**
 * GET: /stats/chart/arearange
 */
const arearange = (req, res) => {
  res.json({
    chart: {
      type: 'arearange',
    },
    xAxis: {
      type: 'datetime',
    },
    series: [{
      name: '気温',
      data: [
        [1483228800000, 3.1, 9.7],
        [1485907200000, 2.8, 7.4],
        [1488326400000, 5.7, 16.9],
        [1491004800000, 11.6, 18.4],
        [1493596800000, 16.3, 24.3],
        [1496275200000, 20.0, 29.9],
        [1498867200000, 22.9, 34.0],
        [1501545600000, 27.9, 35.5],
        [1504224000000, 23.6, 30.5],
        [1506816000000, 12.5, 26.3],
        [1509494400000, 9.3, 19.4],
        [1512086400000, 5.5, 10.4],
      ],
    }],
  });
};

/**
 * GET: /stats/chart/areaspline
 */
const areaspline = (req, res) => {
  res.json({
    chart: {
      type: 'areaspline',
    },
    xAxis: {
      categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    series: [{
      name: 'SiteX',
      data: [30000, 40000, 30000, 50000, 40000, 100000, 120000],
    }, {
      name: 'SiteY',
      data: [10000, 30000, 40000, 30000, 30000, 50000, 40000],
    }, {
      name: 'SiteZ',
      data: [60000, 50000, 30000, 20000, 50000, 60000, 80000],
    }],
  });
};

/**
 * GET: /stats/chart/areasplinerange
 */
const areasplinerange = (req, res) => {
  res.json({
    chart: {
      type: 'areasplinerange',
    },
    xAxis: {
      type: 'datetime',
    },
    series: [{
      name: '気温',
      data: [
        [1483228800000, 3.1, 9.7],
        [1485907200000, 2.8, 7.4],
        [1488326400000, 5.7, 16.9],
        [1491004800000, 11.6, 18.4],
        [1493596800000, 16.3, 24.3],
        [1496275200000, 20.0, 29.9],
        [1498867200000, 22.9, 34.0],
        [1501545600000, 27.9, 35.5],
        [1504224000000, 23.6, 30.5],
        [1506816000000, 12.5, 26.3],
        [1509494400000, 9.3, 19.4],
        [1512086400000, 5.5, 10.4],
      ],
    }],
  });
};

/**
 * GET: /stats/chart/bar
 */
const bar = (req, res) => {
  res.json({
    chart: {
      type: 'bar',
    },
    xAxis: {
      categories: ['2014', '2015', '2016', '2017'],
    },
    series: [{
      name: 'siteX',
      data: [3107, 2031, 1635, 203],
    }, {
      name: 'siteY',
      data: [133, 156, 947, 408],
    }, {
      name: 'siteZ',
      data: [1052, 954, 4250, 5740],
    }],
  });
};

/**
 * GET: /stats/chart/bellcurve
 */
const bellcurve = (req, res) => {
  res.json({
    xAxis: [{
      title: {
        text: '度数',
      },
    }, {
      title: {
        text: '分布',
      },
      opposite: true,
    }],
    yAxis: [{
      title: {
        text: '身長/体重',
      }
    }, {
      title: {
        text: '分布',
      },
      opposite: true,
    }],
    series: [{
      name: '分布',
      type: 'bellcurve',
      xAxis: 1,
      yAxis: 1,
      baseSeries: 1,
      zIndex: -1,
    }, {
      name: 'データ',
      type: 'scatter',
      data: [
        3.5, 3, 3.2, 3.1, 3.6, 3.9, 3.4, 3.4, 2.9, 3.1, 3.7, 3.4, 3, 3, 4,
        4.4, 3.9, 3.5, 3.8, 3.8, 3.4, 3.7, 3.6, 3.3, 3.4, 3, 3.4, 3.5, 3.4, 3.2,
        3.1, 3.4, 4.1, 4.2, 3.1, 3.2, 3.5, 3.6, 3, 3.4, 3.5, 2.3, 3.2, 3.5, 3.8, 3,
        3.8, 3.2, 3.7, 3.3, 3.2, 3.2, 3.1, 2.3, 2.8, 2.8, 3.3, 2.4, 2.9, 2.7, 2, 3,
        2.2, 2.9, 2.9, 3.1, 3, 2.7, 2.2, 2.5, 3.2, 2.8, 2.5, 2.8, 2.9, 3, 2.8, 3,
        2.9, 2.6, 2.4, 2.4, 2.7, 2.7, 3, 3.4, 3.1, 2.3, 3, 2.5, 2.6, 3, 2.6, 2.3,
        2.7, 3, 2.9, 2.9, 2.5, 2.8, 3.3, 2.7, 3, 2.9, 3, 3, 2.5, 2.9, 2.5, 3.6,
        3.2, 2.7, 3, 2.5, 2.8, 3.2, 3, 3.8, 2.6, 2.2, 3.2, 2.8, 2.8, 2.7, 3.3, 3.2,
        2.8, 3, 2.8, 3, 2.8, 3.8, 2.8, 2.8, 2.6, 3, 3.4, 3.1, 3, 3.1, 3.1, 3.1, 2.7,
        3.2, 3.3, 3, 2.5, 3, 3.4, 3
      ],
      marker: {
        radius: 1.5,
      },
    }],
  });
};

/**
 * GET: /stats/chart/boxplot
 */
const boxplot = (req, res) => {
  res.json({
    chart: {
      type: 'boxplot',
    },
    xAxis: {
      categories: ['銘柄A', '銘柄B', '銘柄C', '銘柄D', '銘柄E'],
    },
    series: [{
      name: '2017年度',
      data: [
        [760, 801, 848, 895, 965],
        [733, 853, 939, 980, 1080],
        [714, 762, 817, 870, 918],
        [724, 802, 806, 871, 950],
        [834, 836, 864, 882, 800]
      ],
    }, {
      name: '期末',
      type: 'scatter',
      data: [
        [0, 780],
        [1, 940],
        [2, 901],
        [3, 869],
        [4, 840],
      ],
    }],
  });
};

/**
 * GET: /stats/chart/bubble
 */
const bubble = (req, res) => {
  res.json({
    chart: {
      type: 'bubble',
    },
    legend: {
      enabled: false
    },
    xAxis: {
      plotLines: [{
        color: 'black',
        dashStyle: 'dot',
        width: 2,
        value: 20,
        zIndex: 3,
      }],
      labels: {
        format: '{value} gr'
      },
    },
    yAxis: {
      plotLines: [{
        color: 'black',
        dashStyle: 'dot',
        width: 2,
        value: 50,
        zIndex: 3,
      }],
      labels: {
        format: '{value} gr'
      },
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: '{point.name}'
        }
      }
    },
    tooltip: {
      headerFormat: '',
      pointFormat: '{point.country}: Fat {point.x}g, Sugar {point.y}g'
    },
    series: [{
      data: [
        {x: 95, y: 95, z: 13.8, name: 'BE', country: 'Belgium'},
        {x: 86.5, y: 102.9, z: 14.7, name: 'DE', country: 'Germany'},
        {x: 80.8, y: 91.5, z: 15.8, name: 'FI', country: 'Finland'},
        {x: 80.4, y: 102.5, z: 12, name: 'NL', country: 'Netherlands'},
        {x: 80.3, y: 86.1, z: 11.8, name: 'SE', country: 'Sweden'},
        {x: 78.4, y: 70.1, z: 16.6, name: 'ES', country: 'Spain'},
        {x: 74.2, y: 68.5, z: 14.5, name: 'FR', country: 'France'},
        {x: 73.5, y: 83.1, z: 10, name: 'NO', country: 'Norway'},
        {x: 71, y: 93.2, z: 24.7, name: 'UK', country: 'United Kingdom'},
        {x: 69.2, y: 57.6, z: 10.4, name: 'IT', country: 'Italy'},
        {x: 68.6, y: 20, z: 16, name: 'RU', country: 'Russia'},
        {x: 65.5, y: 126.4, z: 35.3, name: 'US', country: 'United States'},
        {x: 65.4, y: 50.8, z: 28.5, name: 'HU', country: 'Hungary'},
        {x: 63.4, y: 51.8, z: 15.4, name: 'PT', country: 'Portugal'},
        {x: 64, y: 82.9, z: 31.3, name: 'NZ', country: 'New Zealand'}
      ],
    }],
  });
};

/**
 * GET: /stats/chart/bullet
 */
const bullet = (req, res) => {
  res.json({
    chart: {
      type: 'bullet', inverted: true,
    },
    xAxis: {
      categories: ['人数'],
    },
    yAxis: {
      plotBands: [
        {
          from: 0, to: 5000, color: '#666',
        },
        {
          from: 5000, to: 8500, color: '#999',
        },
        {
          from: 8500, to: 15000, color: '#bbb',
        }
      ],
    },
    series: [{
      name: '新規獲得数',
      data: [{
        y: 9500,
        target: 10000,
      }],
    }, {
      name: 'カムバックユーザ数',
      data: [{
        y: 3400,
        target: 8000,
      }],
    }],
  });
};

/**
 * GET: /stats/chart/column
 */
const column = (req, res) => {
  res.json({
    chart: {
      type: 'column',
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    yAxis: {
      title: {
        text: '降水量(mm)'
      },
    },
    series: [{
      name: 'Tokyo',
      data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
    }, {
      name: 'New York',
      data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3],
    }, {
      name: 'London',
      data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2],
    }, {
      name: 'Berlin',
      data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1],
    }],
  });
};

/**
 * GET: /stats/chart/columnrange
 */
const columnrange = (req, res) => {
  res.json({
    chart: {
      type: 'columnrange', inverted: true,
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    series: [{
      name: '気温',
      data: [
        [-9.7, 9.4],
        [-8.7, 6.5],
        [-3.5, 9.4],
        [-1.4, 19.9],
        [0.0, 22.6],
        [2.9, 29.5],
        [9.2, 30.7],
        [7.3, 26.5],
        [4.4, 18.0],
        [-3.1, 11.4],
        [-5.2, 10.4],
        [-13.5, 9.8]
      ],
    }],
  });
};

/**
 * GET: /stats/chart/errorbar
 */
const errorbar = (req, res) => {
  res.json({
    xAxis: [{
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    }],
    yAxis: [{
      title: {
        text: '気温',
      },
    }, {
      title: {
        text: '降水量',
      },
      labels: {
        format: '{value} mm',
      },
      opposite: true,
    }],
    series: [{
      name: '降水量',
      type: 'column',
      yAxis: 1,
      data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
    }, {
      name: '降水量 error',
      type: 'errorbar',
      yAxis: 1,
      data: [[48, 51], [68, 73], [92, 110], [128, 136], [140, 150], [171, 179], [135, 143], [142, 149], [204, 220], [189, 199], [95, 110], [52, 56]],
    }, {
      name: '気温',
      type: 'spline',
      data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
    }, {
      name: '気温 error',
      type: 'errorbar',
      data: [[6, 8], [5.9, 7.6], [9.4, 10.4], [14.1, 15.9], [18.0, 20.1], [21.0, 24.0], [23.2, 25.3], [26.1, 27.8], [23.2, 23.9], [18.0, 21.1], [12.9, 14.0], [7.6, 10.0]],
    }],
  });
};

/**
 * GET: /stats/chart/funnel
 */
const funnel = (req, res) => {
  res.json({
    chart: {
      type: 'funnel',
    },
    plotOptions: {
      funnel: {
        center: ['40%', '50%'],
        neckWidth: '40%',
        neckHeight: '25%',
        width: '80%',
      },
    },
    series: [{
      name: 'One',
      data: [
        ['訪問者', 15654],
        ['ダウンロード', 4064],
        ['資料請求', 1987],
        ['購入', 976],
        ['決済済み', 846]
      ]
    }],
  });
};

/**
 * GET: /stats/chart/gauge
 */
const gauge = (req, res) => {
  res.json({
    chart: {
      type: 'gauge',
    },
    yAxis: {
      min: 0,
      max: 100,
    },
    series: [{
      name: 'Speed',
      data: [80],
    }],
  });
};

/**
 * GET: /stats/chart/heatmap
 */
const heatmap = (req, res) => {
  res.json({
    chart: {
      type: 'heatmap',
    },
    xAxis: {
      categories: ['Alexander', 'Marie', 'Maximilian', 'Sophia', 'Lukas', 'Maria', 'Leon', 'Anna', 'Tim', 'Laura'],
    },
    yAxis: {
      categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    colorAxis: {
      min: 0,
      minColor: '#FFFFFF',
      maxColor: '#1667B2',
    },
    series: [{
      name: 'Sales per employee',
      data: [
        [0, 0, 10], [0, 1, 19], [0, 2, 8], [0, 3, 24], [0, 4, 67],
        [1, 0, 92], [1, 1, 58], [1, 2, 78], [1, 3, 117], [1, 4, 48],
        [2, 0, 35], [2, 1, 15], [2, 2, 123], [2, 3, 64], [2, 4, 52],
        [3, 0, 72], [3, 1, 132], [3, 2, 114], [3, 3, 19], [3, 4, 16],
        [4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117], [4, 4, 115],
        [5, 0, 88], [5, 1, 32], [5, 2, 12], [5, 3, 6], [5, 4, 120],
        [6, 0, 13], [6, 1, 44], [6, 2, 88], [6, 3, 98], [6, 4, 96],
        [7, 0, 31], [7, 1, 1], [7, 2, 82], [7, 3, 32], [7, 4, 30],
        [8, 0, 85], [8, 1, 97], [8, 2, 123], [8, 3, 64], [8, 4, 84],
        [9, 0, 47], [9, 1, 114], [9, 2, 31], [9, 3, 48], [9, 4, 91]
      ],
    }],
  });
};

/**
 * GET: /stats/chart/histogram
 */
const histogram = (req, res) => {
  res.json({
    xAxis: [{
      title: {
        text: '度数',
      },
    }, {
      title: {
        text: 'Histogram',
      },
      opposite: true,
    }],
    yAxis: [{
      title: {
        text: '身長/体重',
      },
    }, {
      title: {
        text: 'Histogram',
      },
      opposite: true,
    }],
    series: [{
      name: 'Histogram',
      type: 'histogram',
      xAxis: 1,
      yAxis: 1,
      baseSeries: 1,
      zIndex: -1,
    }, {
      name: '身長/体重',
      type: 'scatter',
      data: [3.5, 3, 3.2, 3.1, 3.6, 3.9, 3.4, 3.4, 2.9, 3.1, 3.7, 3.4, 3, 3, 4, 4.4, 3.9, 3.5, 3.8, 3.8, 3.4, 3.7, 3.6, 3.3, 3.4, 3, 3.4, 3.5, 3.4, 3.2, 3.1, 3.4, 4.1, 4.2, 3.1, 3.2, 3.5, 3.6, 3, 3.4, 3.5, 2.3, 3.2, 3.5, 3.8, 3, 3.8, 3.2, 3.7, 3.3, 3.2, 3.2, 3.1, 2.3, 2.8, 2.8, 3.3, 2.4, 2.9, 2.7, 2, 3, 2.2, 2.9, 2.9, 3.1, 3, 2.7, 2.2, 2.5, 3.2, 2.8, 2.5, 2.8, 2.9, 3, 2.8, 3, 2.9, 2.6, 2.4, 2.4, 2.7, 2.7, 3, 3.4, 3.1, 2.3, 3, 2.5, 2.6, 3, 2.6, 2.3, 2.7, 3, 2.9, 2.9, 2.5, 2.8, 3.3, 2.7, 3, 2.9, 3, 3, 2.5, 2.9, 2.5, 3.6, 3.2, 2.7, 3, 2.5, 2.8, 3.2, 3, 3.8, 2.6, 2.2, 3.2, 2.8, 2.8, 2.7, 3.3, 3.2, 2.8, 3, 2.8, 3, 2.8, 3.8, 2.8, 2.8, 2.6, 3, 3.4, 3.1, 3, 3.1, 3.1, 3.1, 2.7, 3.2, 3.3, 3, 2.5, 3, 3.4, 3],
      marker: {
        radius: 1.5,
      },
    }],
  });
};

/**
 * GET: /stats/chart/line
 */
const line = (req, res) => {
  res.json({
    chart: {
      type: 'line',
    },
    plotOptions: {
      line: {
        pointStart: 2010,
      },
    },
    yAxis: {
      title: {
        text: 'Number of Employees'
      }
    },
    series: [{
      name: 'Installation',
      data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175],
    }, {
      name: 'Manufacturing',
      data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434],
    }, {
      name: 'Sales & Distribution',
      data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387],
    }, {
      name: 'Project Development',
      data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227],
    }, {
      name: 'Other',
      data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111],
    }],
  });
};

/**
 * GET: /stats/chart/pareto
 */
const pareto = (req, res) => {
  res.json({
    chart: {
      type: 'column',
    },
    xAxis: {
      categories: ['Overpriced', 'Small portions', 'Wait time', 'Food is tasteless', 'No atmosphere', 'Not clean', 'Too noisy', 'Unfriendly staff'],
    },
    yAxis: [{
      title: {
        text: null,
      },
    }, {
      title: {
        text: null,
      },
      max: 100,
      min: 0,
      opposite: true,
    }],
    series: [{
      type: 'pareto',
      name: 'Pareto',
      yAxis: 1,
      zIndex: 10,
      baseSeries: 1,
    }, {
      name: 'Complaints',
      type: 'column',
      zIndex: 2,
      data: [755, 222, 151, 86, 72, 51, 36, 10],
    }],
  });
};

/**
 * GET: /stats/chart/pie
 */
const pie = (req, res) => {
  res.json({
    chart: {
      type: 'pie',
    },
    series: [{
      name: 'Brands',
      data: [{
        name: 'IE',
        y: 56.33,
      }, {
        name: 'Chrome',
        y: 24.03,
      }, {
        name: 'Firefox',
        y: 10.38,
      }, {
        name: 'Safari',
        y: 4.77,
      }, {
        name: 'Opera',
        y: 0.91,
      }, {
        name: 'Other',
        y: 0.2,
      }],
    }],
  });
};

/**
 * GET: /stats/chart/polygon
 */
const polygon = (req, res) => {
  res.json({
    xAxis: {
      title: {
        enabled: true,
        text: '身長(cm)',
      },
      min: 120,
      max: 200,
    },
    yAxis: {
      title: {
        text: '体重(kg)'
      },
    },
    series: [{
      name: '対象',
      type: 'polygon',
      data: [[153, 42], [149, 46], [149, 55], [152, 60], [159, 70], [170, 77], [180, 70], [180, 60], [173, 52], [166, 45]],
    }, {
      name: 'サンプル',
      type: 'scatter',
      data: [
        [161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0], [155.8, 53.6],
        [170.0, 59.0], [159.1, 47.6], [166.0, 69.8], [176.2, 66.8], [160.2, 75.2],
        [172.5, 55.2], [170.9, 54.2], [172.9, 62.5], [153.4, 42.0], [160.0, 50.0],
        [147.2, 49.8], [168.2, 49.2], [175.0, 73.2], [157.0, 47.8], [167.6, 68.8]
      ],
    }],
  });
};

/**
 * GET: /stats/chart/pyramid
 */
const pyramid = (req, res) => {
  res.json({
    chart: {
      type: 'pyramid',
    },
    plotOptions: {
      pyramid: {
        center: ['40%', '50%'],
        width: '80%',
      },
    },
    series: [{
      name: 'Unique users',
      data: [
        ['訪問者', 15654],
        ['ダウンロード', 4064],
        ['資料請求', 1987],
        ['購入', 976],
        ['決済済み', 846]
      ],
    }],
  });
};

/**
 * GT: /stats/chart/sankey
 */
const sankey = (req, res) => {
  res.json({
    chart: {
      type: 'sankey',
    },
    series: [{
      keys: ['from', 'to', 'weight'],
      data: [
        ['Brazil', 'Portugal', 5],
        ['Brazil', 'France', 1],
        ['Brazil', 'England', 1],
        ['Canada', 'Portugal', 1],
        ['Canada', 'France', 5],
        ['Canada', 'England', 1],
        ['USA', 'Portugal', 1],
        ['USA', 'France', 1],
        ['USA', 'England', 5],
        ['Portuga', 'Angola', 2],
        ['Portugal', 'Morocco', 1],
        ['France', 'Angola', 1],
        ['France', 'Mali', 3],
        ['France', 'Morocco', 3],
        ['England', 'Angola', 1],
        ['England', 'Morocco', 2],
        ['Angola', 'China', 5],
        ['Angola', 'India', 1],
        ['Angola', 'Japan', 3],
        ['Mali', 'China', 5],
        ['Mali', 'India', 1],
        ['Mali', 'Japan', 3],
        ['Morocco', 'China', 5],
        ['Morocco', 'India', 1],
        ['Morocco', 'Japan', 3]
      ],
      name: 'Sankey demo series',
    }],
  });
};

/**
 * GET: /stats/chart/scatter
 */
const scatter = (req, res) => {
  res.json({
    chart: {
      type: 'scatter',
    },
    series: [{
      name: 'Female',
      data: [
        [161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0], [155.8, 53.6],
        [170.0, 59.0], [159.1, 47.6], [166.0, 69.8], [176.2, 66.8], [160.2, 75.2],
        [172.5, 55.2], [170.9, 54.2], [172.9, 62.5], [153.4, 42.0], [160.0, 50.0],
        [147.2, 49.8], [168.2, 49.2], [175.0, 73.2], [157.0, 47.8], [167.6, 68.8],
        [159.5, 50.6], [175.0, 82.5], [166.8, 57.2], [176.5, 87.8], [170.2, 72.8]
      ],
    }, {
      name: 'Male',
      data: [
        [174.0, 65.6], [175.3, 71.8], [193.5, 80.7], [186.5, 72.6], [187.2, 78.8],
        [181.5, 74.8], [184.0, 86.4], [184.5, 78.4], [175.0, 62.0], [184.0, 81.6],
        [180.0, 76.6], [177.8, 83.6], [192.0, 90.0], [176.0, 74.6], [174.0, 71.0]
      ],
    }],
  });
};

/**
 * GET: /stats/chart/solidGauge
 */
const solidGauge = (req, res) => {
  res.json({
    chart: {
      type: 'solidgauge',
    },
    yAxis: {
      min: 0,
      max: 200,
    },
    series: [{
      name: 'Speed',
      data: [80],
    }],
  });
};

/**
 * GET: /stats/chart/spline
 */
const spline = (req, res) => {
  res.json({
    chart: {
      type: 'spline',
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        month: '%e. %b',
        year: '%b'
      },
      title: {
        text: 'Date'
      }
    },
    yAxis: {
      title: {
        text: '積雪量(m)'
      },
      min: 0
    },
    series: [{
      name: 'Winter 2012-2013',
      data: [
        [Date.UTC(1970, 9, 21), 0],
        [Date.UTC(1970, 10, 4), 0.28],
        [Date.UTC(1970, 10, 9), 0.25],
        [Date.UTC(1970, 10, 27), 0.2],
        [Date.UTC(1970, 11, 2), 0.28],
        [Date.UTC(1970, 11, 26), 0.28],
        [Date.UTC(1970, 11, 29), 0.47],
        [Date.UTC(1971, 0, 11), 0.79],
        [Date.UTC(1971, 0, 26), 0.72],
        [Date.UTC(1971, 1, 3), 1.02],
        [Date.UTC(1971, 1, 11), 1.12],
        [Date.UTC(1971, 1, 25), 1.2],
        [Date.UTC(1971, 2, 11), 1.18],
        [Date.UTC(1971, 3, 11), 1.19],
        [Date.UTC(1971, 4, 1), 1.85],
        [Date.UTC(1971, 4, 5), 2.22],
        [Date.UTC(1971, 4, 19), 1.15],
        [Date.UTC(1971, 5, 3), 0]
      ]
    }, {
      name: 'Winter 2013-2014',
      data: [
        [Date.UTC(1970, 9, 29), 0],
        [Date.UTC(1970, 10, 9), 0.4],
        [Date.UTC(1970, 11, 1), 0.25],
        [Date.UTC(1971, 0, 1), 1.66],
        [Date.UTC(1971, 0, 10), 1.8],
        [Date.UTC(1971, 1, 19), 1.76],
        [Date.UTC(1971, 2, 25), 2.62],
        [Date.UTC(1971, 3, 19), 2.41],
        [Date.UTC(1971, 3, 30), 2.05],
        [Date.UTC(1971, 4, 14), 1.7],
        [Date.UTC(1971, 4, 24), 1.1],
        [Date.UTC(1971, 5, 10), 0]
      ]
    }, {
      name: 'Winter 2014-2015',
      data: [
        [Date.UTC(1970, 10, 25), 0],
        [Date.UTC(1970, 11, 6), 0.25],
        [Date.UTC(1970, 11, 20), 1.41],
        [Date.UTC(1970, 11, 25), 1.64],
        [Date.UTC(1971, 0, 4), 1.6],
        [Date.UTC(1971, 0, 17), 2.55],
        [Date.UTC(1971, 0, 24), 2.62],
        [Date.UTC(1971, 1, 4), 2.5],
        [Date.UTC(1971, 1, 14), 2.42],
        [Date.UTC(1971, 2, 6), 2.74],
        [Date.UTC(1971, 2, 14), 2.62],
        [Date.UTC(1971, 2, 24), 2.6],
        [Date.UTC(1971, 3, 2), 2.81],
        [Date.UTC(1971, 3, 12), 2.63],
        [Date.UTC(1971, 3, 28), 2.77],
        [Date.UTC(1971, 4, 5), 2.68],
        [Date.UTC(1971, 4, 10), 2.56],
        [Date.UTC(1971, 4, 15), 2.39],
        [Date.UTC(1971, 4, 20), 2.3],
        [Date.UTC(1971, 5, 5), 2],
        [Date.UTC(1971, 5, 10), 1.85],
        [Date.UTC(1971, 5, 15), 1.49],
        [Date.UTC(1971, 5, 23), 1.08]
      ]
    }],
  });
};

/**
 * GET: /stats/chart/streamgraph
 */
const streamgraph = (req, res) => {
  res.json({
    chart: {
      type: 'streamgraph',
    },
    yAxis: {
      visible: false,
    },
    xAxis: {
      type: 'category',
      categories: [
        '',
        '1948 St. Moritz',
        '1952 Oslo',
        '1956 Cortina d\'Ampezzo',
        '1960 Squaw Valley',
        '1964 Innsbruck',
        '1968 Grenoble',
        '1972 Sapporo',
        '1976 Innsbruck',
        '1980 Lake Placid',
        '1984 Sarajevo',
        '1988 Calgary',
        '1992 Albertville',
        '1994 Lillehammer',
        '1998 Nagano',
        '2002 Salt Lake City',
        '2006 Turin',
        '2010 Vancouver',
        '2014 Sochi'
      ],
    },
    series: [{
      name: 'Finland',
      data: [0, 6, 9, 7, 8, 10, 5, 5, 7, 9, 13, 7, 7, 6, 12, 7, 9, 5, 5],
    }, {
      name: 'Austria',
      data: [0, 8, 8, 11, 6, 12, 11, 5, 6, 7, 1, 10, 21, 9, 17, 17, 23, 16, 17],
    }, {
      name: 'Sweden',
      data: [0, 10, 4, 10, 7, 7, 8, 4, 2, 4, 8, 6, 4, 3, 3, 7, 14, 11, 15],
    }, {
      name: 'Norway',
      data: [0, 10, 16, 4, 6, 15, 14, 12, 7, 10, 9, 5, 20, 26, 25, 25, 19, 23, 26],
    }, {
      name: 'U.S.',
      data: [0, 9, 11, 7, 10, 7, 7, 8, 10, 12, 8, 6, 11, 13, 13, 34, 25, 37, 28],
    }],
  });
};

/**
 * GET: /stats/chart/sunburst
 */
const sunburst = (req, res) => {
  res.json({
    chart: {
      type: 'sunburst',
    },
    series: [{
      levels: [{
        level: 2,
        colorByPoint: true,
        dataLabels: {
          rotationMode: 'parallel'
        }
      },
      {
        level: 3,
        colorVariation: {
          key: 'brightness',
          to: -0.5
        }
      }, {
        level: 4,
        colorVariation: {
          key: 'brightness',
          to: 0.5
        }
      }],
      tooltip: {
        headerFormat: '',
        pointFormat: 'The population of <b>{point.name}</b> is <b>{point.value}</b>'
      },
      data: [
        {
          id: '0.0',
          parent: '',
          name: 'America'
        },

        {
          id: '1.1',
          parent: '0.0',
          name: 'South America'
        }, {
          id: '2.98',
          parent: '1.1',
          name: 'Brazil',
          value: 209288278
        }, {
          id: '2.99',
          parent: '1.1',
          name: 'Colombia',
          value: 49065615
        }, {
          id: '2.100',
          parent: '1.1',
          name: 'Argentina',
          value: 44271041
        }, {
          id: '2.101',
          parent: '1.1',
          name: 'Peru',
          value: 32165485
        }, {
          id: '2.102',
          parent: '1.1',
          name: 'Venezuela',
          value: 31977065
        }, {
          id: '2.103',
          parent: '1.1',
          name: 'Chile',
          value: 18054726
        }, {
          id: '2.104',
          parent: '1.1',
          name: 'Ecuador',
          value: 16624858
        }, {
          id: '2.105',
          parent: '1.1',
          name: 'Bolivia',
          value: 11051600
        }, {
          id: '2.106',
          parent: '1.1',
          name: 'Paraguay',
          value: 6811297
        }, {
          id: '2.107',
          parent: '1.1',
          name: 'Uruguay',
          value: 3456750
        }, {
          id: '2.108',
          parent: '1.1',
          name: 'Guyana',
          value: 777859
        }, {
          id: '2.109',
          parent: '1.1',
          name: 'Suriname',
          value: 563402
        }, {
          id: '2.110',
          parent: '1.1',
          name: 'French Guiana',
          value: 282731
        }, {
          id: '2.111',
          parent: '1.1',
          name: 'Falkland Islands',
          value: 2910
        },

        {
          id: '1.2',
          parent: '0.0',
          name: 'Northern America'
        }, {
          id: '2.93',
          parent: '1.2',
          name: 'United States',
          value: 324459463
        }, {
          id: '2.94',
          parent: '1.2',
          name: 'Canada',
          value: 36624199
        }, {
          id: '2.95',
          parent: '1.2',
          name: 'Bermuda',
          value: 61349
        }, {
          id: '2.96',
          parent: '1.2',
          name: 'Greenland',
          value: 56480
        }, {
          id: '2.97',
          parent: '1.2',
          name: 'Saint Pierre and Miquelon',
          value: 6320
        },

        {
          id: '1.3',
          parent: '0.0',
          name: 'Central America'
        }, {
          id: '2.85',
          parent: '1.3',
          name: 'Mexico',
          value: 129163276
        }, {
          id: '2.86',
          parent: '1.3',
          name: 'Guatemala',
          value: 16913503
        }, {
          id: '2.87',
          parent: '1.3',
          name: 'Honduras',
          value: 9265067
        }, {
          id: '2.88',
          parent: '1.3',
          name: 'El Salvador',
          value: 6377853
        }, {
          id: '2.89',
          parent: '1.3',
          name: 'Nicaragua',
          value: 6217581
        }, {
          id: '2.90',
          parent: '1.3',
          name: 'Costa Rica',
          value: 4905769
        }, {
          id: '2.91',
          parent: '1.3',
          name: 'Panama',
          value: 4098587
        }, {
          id: '2.92',
          parent: '1.3',
          name: 'Belize',
          value: 374681
        },

        {
          id: '1.4',
          parent: '0.0',
          name: 'Caribbean'
        }, {
          id: '2.59',
          parent: '1.4',
          name: 'Cuba',
          value: 11484636
        }, {
          id: '2.60',
          parent: '1.4',
          name: 'Haiti',
          value: 10981229
        }, {
          id: '2.61',
          parent: '1.4',
          name: 'Dominican Republic',
          value: 10766998
        }, {
          id: '2.62',
          parent: '1.4',
          name: 'Puerto Rico',
          value: 3663131
        }, {
          id: '2.63',
          parent: '1.4',
          name: 'Jamaica',
          value: 2890299
        }, {
          id: '2.64',
          parent: '1.4',
          name: 'Trinidad and Tobago',
          value: 1369125
        }, {
          id: '2.65',
          parent: '1.4',
          name: 'Guadeloupe',
          value: 449568
        }, {
          id: '2.66',
          parent: '1.4',
          name: 'Bahamas',
          value: 395361
        }, {
          id: '2.67',
          parent: '1.4',
          name: 'Martinique',
          value: 384896
        }, {
          id: '2.68',
          parent: '1.4',
          name: 'Barbados',
          value: 285719
        }, {
          id: '2.69',
          parent: '1.4',
          name: 'Saint Lucia',
          value: 178844
        }, {
          id: '2.70',
          parent: '1.4',
          name: 'Curaçao',
          value: 160539
        }, {
          id: '2.71',
          parent: '1.4',
          name: 'Saint Vincent and the Grenadines',
          value: 109897
        }, {
          id: '2.72',
          parent: '1.4',
          name: 'Grenada',
          value: 107825
        }, {
          id: '2.73',
          parent: '1.4',
          name: 'Aruba',
          value: 105264
        }, {
          id: '2.74',
          parent: '1.4',
          name: 'United States Virgin Islands',
          value: 104901
        }, {
          id: '2.75',
          parent: '1.4',
          name: 'Antigua and Barbuda',
          value: 102012
        }, {
          id: '2.76',
          parent: '1.4',
          name: 'Dominica',
          value: 73925
        }, {
          id: '2.77',
          parent: '1.4',
          name: 'Cayman Islands',
          value: 61559
        }, {
          id: '2.78',
          parent: '1.4',
          name: 'Saint Kitts and Nevis',
          value: 55345
        }, {
          id: '2.79',
          parent: '1.4',
          name: 'Sint Maarten',
          value: 40120
        }, {
          id: '2.80',
          parent: '1.4',
          name: 'Turks and Caicos Islands',
          value: 35446
        }, {
          id: '2.81',
          parent: '1.4',
          name: 'British Virgin Islands',
          value: 31196
        }, {
          id: '2.82',
          parent: '1.4',
          name: 'Caribbean Netherlands',
          value: 25398
        }, {
          id: '2.83',
          parent: '1.4',
          name: 'Anguilla',
          value: 14909
        }, {
          id: '2.84',
          parent: '1.4',
          name: 'Montserrat',
          value: 5177
        },
      ],
    }],
  });
};

/**
 * GET: /stats/chart/tilemap
 */
const tilemap = (req, res) => {
  res.json({
    chart: {
      type: 'tilemap',
    },
    xAxis: {
      visible: false
    },
    yAxis: {
      visible: false
    },
    colorAxis: {
      dataClasses: [{
        from: 0,
        to: 1000000,
        color: '#F9EDB3',
        name: '< 1M'
      }, {
        from: 1000000,
        to: 5000000,
        color: '#FFC428',
        name: '1M - 5M'
      }, {
        from: 5000000,
        to: 20000000,
        color: '#FF7987',
        name: '5M - 20M'
      }, {
        from: 20000000,
        color: '#FF2371',
        name: '> 20M'
      }]
    },
    tooltip: {
      headerFormat: '',
      pointFormat: 'The population of <b> {point.name}</b> is <b>{point.value}</b>'
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: '{point.hc-a2}',
          color: '#000000',
          style: {
            textOutline: false
          }
        }
      }
    },
    series: [{
      name: '',
      data: [{
        'hc-a2': 'AL',
        name: 'Alabama',
        region: 'South',
        x: 6,
        y: 7,
        value: 4849377
      }, {
        'hc-a2': 'AK',
        name: 'Alaska',
        region: 'West',
        x: 0,
        y: 0,
        value: 737732
      }, {
        'hc-a2': 'AZ',
        name: 'Arizona',
        region: 'West',
        x: 5,
        y: 3,
        value: 6745408
      }, {
        'hc-a2': 'AR',
        name: 'Arkansas',
        region: 'South',
        x: 5,
        y: 6,
        value: 2994079
      }, {
        'hc-a2': 'CA',
        name: 'California',
        region: 'West',
        x: 5,
        y: 2,
        value: 39250017
      }, {
        'hc-a2': 'CO',
        name: 'Colorado',
        region: 'West',
        x: 4,
        y: 3,
        value: 5540545
      }, {
        'hc-a2': 'CT',
        name: 'Connecticut',
        region: 'Northeast',
        x: 3,
        y: 11,
        value: 3596677
      }, {
        'hc-a2': 'DE',
        name: 'Delaware',
        region: 'South',
        x: 4,
        y: 9,
        value: 935614
      }, {
        'hc-a2': 'DC',
        name: 'District of Columbia',
        region: 'South',
        x: 4,
        y: 10,
        value: 7288000
      }, {
        'hc-a2': 'FL',
        name: 'Florida',
        region: 'South',
        x: 8,
        y: 8,
        value: 20612439
      }, {
        'hc-a2': 'GA',
        name: 'Georgia',
        region: 'South',
        x: 7,
        y: 8,
        value: 10310371
      }, {
        'hc-a2': 'HI',
        name: 'Hawaii',
        region: 'West',
        x: 8,
        y: 0,
        value: 1419561
      }, {
        'hc-a2': 'ID',
        name: 'Idaho',
        region: 'West',
        x: 3,
        y: 2,
        value: 1634464
      }, {
        'hc-a2': 'IL',
        name: 'Illinois',
        region: 'Midwest',
        x: 3,
        y: 6,
        value: 12801539
      }, {
        'hc-a2': 'IN',
        name: 'Indiana',
        region: 'Midwest',
        x: 3,
        y: 7,
        value: 6596855
      }, {
        'hc-a2': 'IA',
        name: 'Iowa',
        region: 'Midwest',
        x: 3,
        y: 5,
        value: 3107126
      }, {
        'hc-a2': 'KS',
        name: 'Kansas',
        region: 'Midwest',
        x: 5,
        y: 5,
        value: 2904021
      }, {
        'hc-a2': 'KY',
        name: 'Kentucky',
        region: 'South',
        x: 4,
        y: 6,
        value: 4413457
      }, {
        'hc-a2': 'LA',
        name: 'Louisiana',
        region: 'South',
        x: 6,
        y: 5,
        value: 4649676
      }, {
        'hc-a2': 'ME',
        name: 'Maine',
        region: 'Northeast',
        x: 0,
        y: 11,
        value: 1330089
      }, {
        'hc-a2': 'MD',
        name: 'Maryland',
        region: 'South',
        x: 4,
        y: 8,
        value: 6016447
      }, {
        'hc-a2': 'MA',
        name: 'Massachusetts',
        region: 'Northeast',
        x: 2,
        y: 10,
        value: 6811779
      }, {
        'hc-a2': 'MI',
        name: 'Michigan',
        region: 'Midwest',
        x: 2,
        y: 7,
        value: 9928301
      }, {
        'hc-a2': 'MN',
        name: 'Minnesota',
        region: 'Midwest',
        x: 2,
        y: 4,
        value: 5519952
      }, {
        'hc-a2': 'MS',
        name: 'Mississippi',
        region: 'South',
        x: 6,
        y: 6,
        value: 2984926
      }, {
        'hc-a2': 'MO',
        name: 'Missouri',
        region: 'Midwest',
        x: 4,
        y: 5,
        value: 6093000
      }, {
        'hc-a2': 'MT',
        name: 'Montana',
        region: 'West',
        x: 2,
        y: 2,
        value: 1023579
      }, {
        'hc-a2': 'NE',
        name: 'Nebraska',
        region: 'Midwest',
        x: 4,
        y: 4,
        value: 1881503
      }, {
        'hc-a2': 'NV',
        name: 'Nevada',
        region: 'West',
        x: 4,
        y: 2,
        value: 2839099
      }, {
        'hc-a2': 'NH',
        name: 'New Hampshire',
        region: 'Northeast',
        x: 1,
        y: 11,
        value: 1326813
      }, {
        'hc-a2': 'NJ',
        name: 'New Jersey',
        region: 'Northeast',
        x: 3,
        y: 10,
        value: 8944469
      }, {
        'hc-a2': 'NM',
        name: 'New Mexico',
        region: 'West',
        x: 6,
        y: 3,
        value: 2085572
      }, {
        'hc-a2': 'NY',
        name: 'New York',
        region: 'Northeast',
        x: 2,
        y: 9,
        value: 19745289
      }, {
        'hc-a2': 'NC',
        name: 'North Carolina',
        region: 'South',
        x: 5,
        y: 9,
        value: 10146788
      }, {
        'hc-a2': 'ND',
        name: 'North Dakota',
        region: 'Midwest',
        x: 2,
        y: 3,
        value: 739482
      }, {
        'hc-a2': 'OH',
        name: 'Ohio',
        region: 'Midwest',
        x: 3,
        y: 8,
        value: 11614373
      }, {
        'hc-a2': 'OK',
        name: 'Oklahoma',
        region: 'South',
        x: 6,
        y: 4,
        value: 3878051
      }, {
        'hc-a2': 'OR',
        name: 'Oregon',
        region: 'West',
        x: 4,
        y: 1,
        value: 3970239
      }, {
        'hc-a2': 'PA',
        name: 'Pennsylvania',
        region: 'Northeast',
        x: 3,
        y: 9,
        value: 12784227
      }, {
        'hc-a2': 'RI',
        name: 'Rhode Island',
        region: 'Northeast',
        x: 2,
        y: 11,
        value: 1055173
      }, {
        'hc-a2': 'SC',
        name: 'South Carolina',
        region: 'South',
        x: 6,
        y: 8,
        value: 4832482
      }, {
        'hc-a2': 'SD',
        name: 'South Dakota',
        region: 'Midwest',
        x: 3,
        y: 4,
        value: 853175
      }, {
        'hc-a2': 'TN',
        name: 'Tennessee',
        region: 'South',
        x: 5,
        y: 7,
        value: 6651194
      }, {
        'hc-a2': 'TX',
        name: 'Texas',
        region: 'South',
        x: 7,
        y: 4,
        value: 27862596
      }, {
        'hc-a2': 'UT',
        name: 'Utah',
        region: 'West',
        x: 5,
        y: 4,
        value: 2942902
      }, {
        'hc-a2': 'VT',
        name: 'Vermont',
        region: 'Northeast',
        x: 1,
        y: 10,
        value: 626011
      }, {
        'hc-a2': 'VA',
        name: 'Virginia',
        region: 'South',
        x: 5,
        y: 8,
        value: 8411808
      }, {
        'hc-a2': 'WA',
        name: 'Washington',
        region: 'West',
        x: 2,
        y: 1,
        value: 7288000
      }, {
        'hc-a2': 'WV',
        name: 'West Virginia',
        region: 'South',
        x: 4,
        y: 7,
        value: 1850326
      }, {
        'hc-a2': 'WI',
        name: 'Wisconsin',
        region: 'Midwest',
        x: 2,
        y: 5,
        value: 5778708
      }, {
        'hc-a2': 'WY',
        name: 'Wyoming',
        region: 'West',
        x: 3,
        y: 3,
        value: 584153
      }]
    }],
  });
};

/**
 * GET: /stats/chart/variablePie
 */
const variablePie = (req, res) => {
  res.json({
    chart: {
      type: 'variablepie',
    },
    series: [{
      name: 'countries',
      data: [{
        name: 'Spain',
        y: 505370,
        z: 92.9,
      }, {
        name: 'France',
        y: 551500,
        z: 118.7,
      }, {
        name: 'Poland',
        y: 312685,
        z: 124.6,
      }, {
        name: 'Czech Republic',
        y: 78867,
        z: 137.5,
      }, {
        name: 'Italy',
        y: 301340,
        z: 201.8,
      }, {
        name: 'Switzerland',
        y: 41277,
        z: 214.5,
      }, {
        name: 'Germany',
        y: 357022,
        z: 235.6,
      }],
    }],
  });
};

/**
 * GET: /stats/chart/variwide
 */
const variwide = (req, res) => {
  res.json({
    chart: {
      type: 'variwide',
    },
    xAxis: {
      type: 'category',
    },
    legend: {
      enabled: false
    },
    series: [{
      name: 'Labor Costs',
      data: [
        ['Norway', 50.2, 335504],
        ['Denmark', 42, 277339],
        ['Belgium', 39.2, 421611],
        ['Sweden', 38, 462057],
        ['France', 35.6, 2228857],
        ['Netherlands', 34.3, 702641],
        ['Finland', 33.2, 215615],
        ['Germany', 33.0, 3144050],
        ['Austria', 32.7, 349344],
        ['Ireland', 30.4, 275567],
        ['Italy', 27.8, 1672438],
        ['United Kingdom', 26.7, 2366911],
        ['Spain', 21.3, 1113851],
        ['Greece', 14.2, 175887],
        ['Portugal', 13.7, 184933],
        ['Czech Republic', 10.2, 176564],
        ['Poland', 8.6, 424269],
        ['Romania', 5.5, 169578]
      ],
      colorByPoint: true
    }],
  });
};

/**
 * GET: /stats/chart/vector
 */
const vector = (req, res) => {
  res.json({
    chart: {
      type: 'vector',
    },
    series: [{
      name: 'Sample vector field',
      data: [
        [1, 5, 190, 18],
        [2, 10, 185, 27],
        [3, 15, 180, 36],
        [4, 20, 175, 45],
        [5, 25, 170, 54],
        [6, 30, 165, 63],
        [7, 35, 160, 72],
        [8, 40, 155, 81],
        [9, 45, 150, 90]]
    }],
  });
};

/**
 * GET: /stats/chart/waterfall
 */
const waterfall = (req, res) => {
  res.json({
    chart: {
      type: 'waterfall',
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      title: {
        text: 'USD',
      },
    },
    legend: {
      enabled: false
    },
    series: [{
      upColor: '#71D0A1',
      color: '#F4656C',
      data: [{
        name: 'Start',
        y: 120000,
      }, {
        name: 'Product Revenue',
        y: 569000,
      }, {
        name: 'Service Revenue',
        y: 231000,
      }, {
        name: 'Positive Balance',
        isIntermediateSum: true,
        color: '#000000',
      }, {
        name: 'Fixed Costs',
        y: -342000,
      }, {
        name: 'Variable Costs',
        y: -233000,
      }, {
        name: 'Balance',
        isSum: true,
        color: '#000000',
      }],
      dataLabels: {
        enabled: true,
      },
      pointPadding: 0
    }],
  });
};

/**
 * GET: /stats/chart/windbarb
 */
const windbarb = (req, res) => {
  res.json({
    chart: {
      type: 'windbarb',
    },
    series: [{
      type: 'windbarb',
      data: [
        [9.8, 177.9],
        [10.1, 177.2],
        [11.3, 179.7],
        [10.9, 175.5],
        [9.3, 159.9],
        [8.8, 159.6],
        [7.8, 162.6],
        [5.6, 186.2]
      ],
      name: 'Wind',
      showInLegend: false,
    }, {
      type: 'area',
      keys: ['y', 'rotation'], // rotation is not used here
      data: [
        [9.8, 177.9],
        [10.1, 177.2],
        [11.3, 179.7],
        [10.9, 175.5],
        [9.3, 159.9],
        [8.8, 159.6],
        [7.8, 162.6],
        [5.6, 186.2]
      ],
      name: 'Wind speed',
    }],
  });
};

/**
 * GET: /stats/chart/wordcloud
 */
const wordcloud = (req, res) => {
  res.json({
    chart: {
      type: 'wordcloud',
    },
    series: [{
      data: [
        {
          name: 'erat', weight: 1,
        },
        {
          name: 'vitae', weight: 2,
        },
        {
          name: 'ut', weight: 3,
        },
        {
          name: 'Praesent', weight: 4,
        },
        {
          name: 'tellus', weight: 5,
        },
        {
          name: 'eget', weight: 6,
        },
        {
          name: 'nec', weight: 7,
        },
        {
          name: 'ac', weight: 8,
        },
        {
          name: 'pretium', weight: 9,
        }
      ],
      name: 'letters',
    }],
  });
};

/**
 * GET: /stats/chart/xrange
 */
const xrange = (req, res) => {
  res.json({
    chart: {
      type: 'xrange',
    },
    yAxis: {
      categories: ['Prototyping', 'Development', 'Testing'],
      reversed: true,
    },
    series: [{
      name: 'Project A',
      data: [{
        x: 0,
        x2: 10,
        y: 0,
        partialFill: 0.5,
      }, {
        x: 6,
        x2: 10,
        y: 1,
      }, {
        x: 10,
        x2: 18,
        y: 2,
      }, {
        x: 19,
        x2: 22,
        y: 2,
      }],
    }],
  });
};

module.exports = {
  'stats_chart#area': area,
  'stats_chart#arearange': arearange,
  'stats_chart#areaspline': areaspline,
  'stats_chart#areasplinerange': areasplinerange,
  'stats_chart#bar': bar,
  'stats_chart#bellcurve': bellcurve,
  'stats_chart#boxplot': boxplot,
  'stats_chart#bubble': bubble,
  'stats_chart#bullet': bullet,
  'stats_chart#column': column,
  'stats_chart#columnrange': columnrange,
  'stats_chart#errorbar': errorbar,
  'stats_chart#funnel': funnel,
  'stats_chart#gauge': gauge,
  'stats_chart#heatmap': heatmap,
  'stats_chart#histogram': histogram,
  'stats_chart#line': line,
  'stats_chart#pareto': pareto,
  'stats_chart#pie': pie,
  'stats_chart#polygon': polygon,
  'stats_chart#pyramid': pyramid,
  'stats_chart#sankey': sankey,
  'stats_chart#scatter': scatter,
  'stats_chart#solidGauge': solidGauge,
  'stats_chart#spline': spline,
  'stats_chart#streamgraph': streamgraph,
  'stats_chart#sunburst': sunburst,
  'stats_chart#tilemap': tilemap,
  'stats_chart#variablePie': variablePie,
  'stats_chart#variwide': variwide,
  'stats_chart#vector': vector,
  'stats_chart#waterfall': waterfall,
  'stats_chart#windbarb': windbarb,
  'stats_chart#wordcloud': wordcloud,
  'stats_chart#xrange': xrange,
};
