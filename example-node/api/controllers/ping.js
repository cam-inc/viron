const show = (req, res) => {
  res.status(200).send('pong');
};

module.exports = {
  'ping#show': show,
};
