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
    x: 'date',
    y: 'effort',
    color: 'team',
    data: [
      {team: 'Alpha', date: '2015-07-15', effort: 400},
      {team: 'Alpha', date: '2015-07-16', effort: 200},
      {team: 'Alpha', date: '2015-07-17', effort: 300},
      {team: 'Alpha', date: '2015-07-18', effort: 500},
      {team: 'Beta', date: '2015-07-15', effort: 100},
      {team: 'Beta', date: '2015-07-16', effort: 200},
      {team: 'Beta', date: '2015-07-17', effort: 300},
      {team: 'Beta', date: '2015-07-18', effort: 100},
      {team: 'Gamma', date: '2015-07-15', effort: 300},
      {team: 'Gamma', date: '2015-07-16', effort: 100},
      {team: 'Gamma', date: '2015-07-17', effort: 100},
      {team: 'Gamma', date: '2015-07-18', effort: 200}
    ]
  });
};

module.exports = {
  'stats#dau': dau,
  'stats#mau': mau,
  'stats#area': area,
};
