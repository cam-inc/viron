import swagger from '../../swagger';
import constants from '../../core/constants';

export default {
  show: (context, obj) => {
    const schema = obj.operationObject.responses[200].schema;
    const response = obj.response;
    const data = swagger.mergeSchemaAndResponse(schema, response);

    context.state.dmc = data;
    return [constants.CHANGE_DMC];
  },

  remove: context => {
    context.state.dmc = null;
    return [constants.CHANGE_DMC];
  }
};
