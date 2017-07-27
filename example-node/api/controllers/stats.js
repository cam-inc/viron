/**
 * GET: /stats/dau
 */
const dau = (req, res) => {
  res.json({
    value: 1234567,
  });
};

/**
 * GET: /stats/mau
 */
const mau = (req, res) => {
  res.json({
    value: 9876543,
  });
};

module.exports = {
  'stats#dau': dau,
  'stats#mau': mau,
};
