
const show = (req, res) => {
  res.json(req.swagger.swaggerObject);
};

module.exports = {
  'swagger#show': show,
};
