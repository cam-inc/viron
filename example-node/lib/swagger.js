/**
 * Get swagger host port
 * @param swaggerExpress
 */
const getPort = (swaggerExpress, defaultValue) => {
  let host = swaggerExpress.runner.swagger.host;
  if (2 <= host.split(':').length && !!parseInt(host.split(':')[1])) {
    return parseInt(host.split(':')[1]);
  }
  return defaultValue;
}

module.exports = {
  getPort: getPort,
};
