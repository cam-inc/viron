const get = (req, res) => {
  res.send(`${req.path} のページです`);
};

module.exports = {
  'page#get': get,
};
