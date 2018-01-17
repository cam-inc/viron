const show = (req, res) => {
  res.redirect('/swagger.json');
};

module.exports = {
  'root#show': show,
};
