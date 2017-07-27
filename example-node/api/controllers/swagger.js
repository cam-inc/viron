
const show = (req, res) => {
  res.json(req._swagger);
};

module.exports = {
  'swagger#show': show,
};
