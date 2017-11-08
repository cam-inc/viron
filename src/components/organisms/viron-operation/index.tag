viron-operation.Operation
  .Operation__info
    div
      .Operation__summary { summary }
      .Operation__description { opts.operationObject.description }
  .Operation__parameters
    viron-operation-parameter(each="{ parameter in opts.operationObject.parameters }" parameter="{ parameter }" parameterValue="{ parent.queries[parameter.name] }" onChange="{ parent.handleParameterChange }")
  .Operation__control
    viron-button(label="{ opts.operationObject.operationId }" onPpat="{ handleExecuteButtonPpat }")
    viron-button(label="cancel" type="secondary" onPpat="{ handleCancelButtonPpat }")

  script.
    import '../../atoms/viron-button/index.tag';
    import './parameter.tag';
    import script from './index';
    this.external(script);
