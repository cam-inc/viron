/**
 * hello world
 */
const hello = (req, res) => {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  const name = req.swagger.params.name.value || 'stranger';
  res.json(`Hello, ${name}!`);
};

module.exports = {
  // swagger.yamlのoperationIdとメソッドを関連付ける
  hello: hello
};
