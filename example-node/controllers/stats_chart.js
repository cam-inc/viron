/**
 * GET: /stats/chart/area
 */
const area = (req, res) => {
  res.json({
    chart: {
      type: 'area',
    },
    plotOptions: {
      area: {
        pointStart: 1940,
      },
    },
    series: [{
      name: 'One',
      data: [
        null, null, null, null, null, 6, 11, 32, 110, 235, 369, 640,
        1005, 1436, 2063, 3057, 4618, 6444, 9822, 15468, 20434, 24126,
        27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342, 26662,
        26956, 27912, 28999, 28965, 27826, 25579, 25722, 24826, 24605,
        24304, 23464, 23708, 24099, 24357, 24237, 24401, 24344, 23586,
        22380, 21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950,
        10871, 10824, 10577, 10527, 10475, 10421, 10358, 10295, 10104
      ],
    }, {
      name: 'Two',
      data: [
        null, null, null, null, null, null, null, null, null, null,
        5, 25, 50, 120, 150, 200, 426, 660, 869, 1060, 1605, 2471, 3322,
        4238, 5221, 6129, 7089, 8339, 9399, 10538, 11643, 13092, 14478,
        15915, 17385, 19055, 21205, 23044, 25393, 27935, 30062, 32049,
        33952, 35804, 37431, 39197, 45000, 43000, 41000, 39000, 37000,
        35000, 33000, 31000, 29000, 27000, 25000, 24000, 23000, 22000,
        21000, 20000, 19000, 18000, 18000, 17000, 16000
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
      name: 'One',
      data: [
        [1388538000000, 1.1, 4.7],
        [1388624400000, 1.8, 6.4],
        [1388710800000, 1.7, 6.9],
        [1388797200000, 2.6, 7.4],
        [1388883600000, 3.3, 9.3],
        [1388970000000, 3.0, 7.9],
        [1389056400000, 3.9, 6.0],
        [1389142800000, 3.9, 5.5],
        [1389229200000, -0.6, 4.5],
        [1389315600000, -0.5, 5.3],
        [1389402000000, -0.3, 2.4],
        [1389488400000, -6.5, -0.4],
        [1389574800000, -7.3, -3.4],
        [1389661200000, -7.3, -2.3],
        [1389747600000, -7.9, -4.2]
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
      name: 'One',
      data: [3, 4, 3, 5, 4, 10, 12],
    }, {
      name: 'Two',
      data: [1, 3, 4, 3, 3, 5, 4],
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
      name: 'One',
      data: [
        [1388538000000, 1.1, 4.7],
        [1388624400000, 1.8, 6.4],
        [1388710800000, 1.7, 6.9],
        [1388797200000, 2.6, 7.4],
        [1388883600000, 3.3, 9.3],
        [1388970000000, 3.0, 7.9],
        [1389056400000, 3.9, 6.0],
        [1389142800000, 3.9, 5.5],
        [1389229200000, -0.6, 4.5],
        [1389315600000, -0.5, 5.3],
        [1389402000000, -0.3, 2.4],
        [1389488400000, -6.5, -0.4],
        [1389574800000, -7.3, -3.4],
        [1389661200000, -7.3, -2.3],
        [1389747600000, -7.9, -4.2]
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
      categories: ['~190', '190~', '180~', '170~', '160~'],
    },
    series: [{
      name: '1800年代',
      data: [107, 31, 635, 203, 2],
    }, {
      name: '1900年代',
      data: [133, 156, 947, 408, 6],
    }, {
      name: '2000年代',
      data: [1052, 954, 4250, 740, 38],
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
        text: '身長',
      },
    }, {
      title: {
        text: '分布',
      },
      opposite: true,
    }],
    yAxis: [{
      title: {
        text: '体重',
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
      name: '身長/体重',
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
        [0, 644],
        [4, 718],
        [4, 951],
        [4, 969]
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
    xAxis: {
      plotLines: [{
        color: 'black',
        dashStyle: 'dot',
        width: 2,
        value: 20,
        zIndex: 3,
      }],
    },
    yAxis: {
      plotLines: [{
        color: 'black',
        dashStyle: 'dot',
        width: 2,
        value: 50,
        zIndex: 3,
      }],
    },
    series: [{
      name: 'One',
      data: [
        {
          x: 86.5, y: 102.9, z: 14.7,
        },
        {
          x: 80.4, y: 102.5, z: 12,
        },
        {
          x: 78.4, y: 70.1, z: 16.6,
        },
        {
          x: 73.5, y: 83.1, z: 10,
        },
        {
          x: 69.2, y: 57.6, z: 10.4,
        },
        {
          x: 65.5, y: 126.4, z: 35.3,
        },
        {
          x: 63.4, y: 51.8, z: 15.4,
        },
      ],
    }, {
      name: 'Two',
      data: [
        {
          x: 95, y: 95, z: 13.8,
        },
        {
          x: 80.8, y: 91.5, z: 15.8,
        },
        {
          x: 80.3, y: 86.1, z: 11.8,
        },
        {
          x: 74.2, y: 68.5, z: 14.5,
        },
        {
          x: 71, y: 93.2, z: 24.7,
        },
        {
          x: 68.6, y: 20, z: 16,
        },
        {
          x: 65.4, y: 50.8, z: 28.5,
        },
        {
          x: 64, y: 82.9, z: 31.3,
        }
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
      categories: ['Label'],
    },
    yAxis: {
      plotBands: [
        {
          from: 0, to: 150, color: '#666',
        },
        {
          from: 150, to: 225, color: '#999',
        },
        {
          from: 225, to: 9e9, color: '#bbb',
        }
      ],
    },
    series: [{
      name: 'One',
      data: [{
        y: 275,
        target: 250,
      }],
    }, {
      name: 'Two',
      data: [{
        y: 100,
        target: 200,
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
      name: 'Temperatures',
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
        text: 'Temperature',
      },
    }, {
      title: {
        text: 'Rainfall',
      },
      labels: {
        format: '{value} mm',
      },
      opposite: true,
    }],
    series: [{
      name: 'Rainfall',
      type: 'column',
      yAxis: 1,
      data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
    }, {
      name: 'Rainfall error',
      type: 'errorbar',
      yAxis: 1,
      data: [[48, 51], [68, 73], [92, 110], [128, 136], [140, 150], [171, 179], [135, 143], [142, 149], [204, 220], [189, 199], [95, 110], [52, 56]],
    }, {
      name: 'Temperature',
      type: 'spline',
      data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
    }, {
      name: 'Temperature error',
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
        ['A', 15654],
        ['B', 4064],
        ['C', 1987],
        ['D', 9706],
        ['E', 846]
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
    series: [{
      name: 'Sales per employee',
      data: [[0, 0, 10], [0, 1, 19], [0, 2, 8], [0, 3, 24], [0, 4, 67], [1, 0, 92], [1, 1, 58], [1, 2, 78], [1, 3, 117], [1, 4, 48], [2, 0, 35], [2, 1, 15], [2, 2, 123], [2, 3, 64], [2, 4, 52], [3, 0, 72], [3, 1, 132], [3, 2, 114], [3, 3, 19], [3, 4, 16], [4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117], [4, 4, 115], [5, 0, 88], [5, 1, 32], [5, 2, 12], [5, 3, 6], [5, 4, 120], [6, 0, 13], [6, 1, 44], [6, 2, 88], [6, 3, 98], [6, 4, 96], [7, 0, 31], [7, 1, 1], [7, 2, 82], [7, 3, 32], [7, 4, 30], [8, 0, 85], [8, 1, 97], [8, 2, 123], [8, 3, 64], [8, 4, 84], [9, 0, 47], [9, 1, 114], [9, 2, 31], [9, 3, 48], [9, 4, 91]],
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
        text: '身長',
      },
    }, {
      title: {
        text: 'Histogram',
      },
      opposite: true,
    }],
    yAxis: [{
      title: {
        text: '体重',
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
    series: [{
      name: 'Target',
      type: 'polygon',
      data: [[153, 42], [149, 46], [149, 55], [152, 60], [159, 70], [170, 77], [180, 70], [180, 60], [173, 52], [166, 45]],
    }, {
      name: 'Observations',
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
        ['A', 15654],
        ['B', 4064],
        ['C', 1987],
        ['D', 976],
        ['E', 846]
      ],
    }],
  });
};

/**
 * GET: /stats/chart/sankey
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
        ['Brazil', 'Spain', 1],
        ['Brazil', 'England', 1],
        ['Canada', 'Portugal', 1],
        ['Canada', 'France', 5],
        ['Canada', 'England', 1],
        ['Mexico', 'Portugal', 1],
        ['Mexico', 'France', 1],
        ['Mexico', 'Spain', 5],
        ['Mexico', 'England', 1],
        ['USA', 'Portugal', 1],
        ['USA', 'France', 1],
        ['USA', 'Spain', 1],
        ['USA', 'England', 5],
        ['Portugal', 'Angola', 2],
        ['Portugal', 'Senegal', 1],
        ['Portugal', 'Morocco', 1],
        ['Portugal', 'South Africa', 3],
        ['France', 'Angola', 1],
        ['France', 'Senegal', 3],
        ['France', 'Mali', 3],
        ['France', 'Morocco', 3],
        ['France', 'South Africa', 1],
        ['Spain', 'Senegal', 1],
        ['Spain', 'Morocco', 3],
        ['Spain', 'South Africa', 1],
        ['England', 'Angola', 1],
        ['England', 'Senegal', 1],
        ['England', 'Morocco', 2],
        ['England', 'South Africa', 7],
        ['South Africa', 'China', 5],
        ['South Africa', 'India', 1],
        ['South Africa', 'Japan', 3],
        ['Angola', 'China', 5],
        ['Angola', 'India', 1],
        ['Angola', 'Japan', 3],
        ['Senegal', 'China', 5],
        ['Senegal', 'India', 1],
        ['Senegal', 'Japan', 3],
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
    series: [{
      name: 'Winter 2012-2013',
      data: [1, 2, 23, 14, 5, 6],
    }, {
      name: 'Winter 2013-2014',
      data: [7, 20, 9, 10, 21, 12],
    }, {
      name: 'Winter 2014-2015',
      data: [12, 11, 10, 9, 28, 7, 6, 52, 4, 3, 2, 1, 0],
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
    xAxis: {
      type: 'category',
      categories: [
        '',
        '1924 Chamonix',
        '1928 St. Moritz',
        '1932 Lake Placid',
        '1936 Garmisch-Partenkirchen',
        '1940 <i>Cancelled (Sapporo)</i>',
        '1944 <i>Cancelled (Cortina d\'Ampezzo)</i>',
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
      data: [0, 11, 4, 3, 6, 0, 0, 6, 9, 7, 8, 10, 5, 5, 7, 9, 13, 7, 7, 6, 12, 7, 9, 5, 5],
    }, {
      name: 'Austria',
      data: [0, 3, 4, 2, 4, 0, 0, 8, 8, 11, 6, 12, 11, 5, 6, 7, 1, 10, 21, 9, 17, 17, 23, 16, 17],
    }, {
      name: 'Sweden',
      data: [0, 2, 5, 3, 7, 0, 0, 10, 4, 10, 7, 7, 8, 4, 2, 4, 8, 6, 4, 3, 3, 7, 14, 11, 15],
    }, {
      name: 'Norway',
      data: [0, 17, 15, 10, 15, 0, 0, 10, 16, 4, 6, 15, 14, 12, 7, 10, 9, 5, 20, 26, 25, 25, 19, 23, 26],
    }, {
      name: 'U.S.',
      data: [0, 4, 6, 12, 4, 0, 0, 9, 11, 7, 10, 7, 7, 8, 10, 12, 8, 6, 11, 13, 13, 34, 25, 37, 28],
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
      data: [{
        id: '0.0',
        parent: '',
        name: 'Center',
      }, {
        id: '1.0',
        parent: '0.0',
        name: 'Inner_A',
      }, {
        id: '1.1',
        parent: '0.0',
        name: 'Inner_B',
      }, {
        id: '1.2',
        parent: '0.0',
        name: 'Inner_C',
      }, {
        id: '2.1',
        parent: '1.1',
        name: 'Outer_A',
        value: 4,
      }, {
        id: '2.2',
        parent: '1.1',
        name: 'Outer_B',
        value: 5,
      }, {
        id: '2.3',
        parent: '1.2',
        name: 'Outer_C',
        value: 1,
      }, {
        id: '2.4',
        parent: '1.0',
        name: 'Outer_D',
        value: 4,
      }],
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
    plotOptions: {
      tilemap: {
        keys: ['x', 'y', 'name'],
      },
    },
    series: [{
      name: 'Main idea',
      data: [
        [5, 3, 'Main idea 1']
      ],
    }, {
      name: 'Steps',
      data: [
        [3, 3, 'Step 1'],
        [4, 3, 'Step 2'],
        [5, 4, 'Step 3'],
        [6, 3, 'Step 4'],
        [7, 3, 'Step 5'],
        [6, 2, 'Step 6'],
        [5, 2, 'Step 7'],
        [4, 2, 'Step 8']
      ],
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
    series: [{
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
      }, {
        name: 'Fixed Costs',
        y: -342000,
      }, {
        name: 'Variable Costs',
        y: -233000,
      }, {
        name: 'Balance',
        isSum: true,
      }],
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
          name: 'aaa', weight: 1,
        },
        {
          name: 'bbbb', weight: 2,
        },
        {
          name: 'ccccc', weight: 3,
        },
        {
          name: 'dddddd', weight: 4,
        },
        {
          name: 'eeeeeee', weight: 5,
        },
        {
          name: 'ffffffff', weight: 6,
        },
        {
          name: 'ggggggggg', weight: 7,
        },
        {
          name: 'hhhhhhhhhh', weight: 8,
        },
        {
          name: 'iiiiiiiiiii', weight: 9,
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
