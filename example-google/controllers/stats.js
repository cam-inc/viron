/**
 * GET: /stats/dau
 */
const dau = (req, res) => {
  const date = new Date();
  res.json({
    value: 1234567 + date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + date.getMinutes(),
  });
};

/**
 * GET: /stats/mau
 */
const mau = (req, res) => {
  const date = new Date();
  res.json({
    value: 9876543 + date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + date.getMinutes(),
  });
};

/**
 * GET: /stats/area
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

module.exports = {
  'stats#dau': dau,
  'stats#mau': mau,
  'stats#area': area,
};
