dmc-operation.Operation
  .Operation__info
    div
      .Operation__summary { summary }
      .Operation__description { opts.operationObject.description }
  .Operation__control
    dmc-button(label="{ opts.operationObject.operationId }" onPat="{ handleExecuteButtonPat }")
    dmc-button(label="cancel" type="secondary" onPat="{ handleCancelButtonPat }")
  .Operation__parameters
    dmc-operation-parameter(each="{ parameter in opts.operationObject.parameters }" parameter="{ parameter }" parameterValue="{ parent.queries[parameter.name] }" onChange="{ parent.handleParameterChange }")

  script.
    import '../../atoms/dmc-button/index.tag';
    import './parameter.tag';
    import script from './index';
    this.external(script);
