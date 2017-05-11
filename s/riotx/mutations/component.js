import constants from '../../core/constants';
import swagger from '../../swagger';

export default {
  one: function (context, params) {
    const schema = params.model.responses[200].schema;
    // const properties = schema.properties;
    const responseObj = params.response.obj;

    let merge = swagger.mergePropertiesAndResponse(schema, responseObj);

    context.state.component[params.component_uid] = context.state.component[params.component_uid] || {};
    context.state.component[params.component_uid].data = merge;
    // `component.pagination` value indicates whether the component supports pagination or not.
    // if supported then manually add pagination information from headers.
    if (params.component.pagination.get()) {
      context.state.component[params.component_uid].pagination = {
        currentPage: Number(params.response.headers['x-pagination-current-page'] || 0),
        size: Number(params.response.headers['x-pagination-limit'] || 0),
        maxPage: Number(params.response.headers['x-pagination-total-pages'] || 0)
      };
    }
    // `component.query`(array) value indicates whether the component supports searching or not.
    // if supported then manually add pagination information from headers.
    if (params.component.query.length && !!params.component.query.length) {
      context.state.component[params.component_uid].search = params.component.query;
    }

    return [constants.changeComponentName(params.component_uid)];
  }
};
