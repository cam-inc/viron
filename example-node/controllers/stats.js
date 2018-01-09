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

module.exports = {
  'stats#dau': dau,
  'stats#mau': mau,
};
