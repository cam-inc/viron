import swagger from '../../core/swagger';
import { constants as states } from '../states';

export default {
  /**
   * @param {riotx.Context} context
   * @param {Object|null} dmc
   * @return {Array}
   */
  all: (context, dmc) => {
    if (!dmc) {
      context.state.dmc = null;
    } else {
      const schema = dmc.operationObject.responses[200].schema;
      const response = dmc.response;
      const data = swagger.mergeSchemaAndResponse(schema, response);
      context.state.dmc = data;
    }
    return [states.DMC];
  }
};
