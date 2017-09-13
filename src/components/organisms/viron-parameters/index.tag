viron-parameters.Parameters
  virtual(each="{ parameterObject in opts.parameterobjects }")
    viron-parameter(parameterObject="{ parameterObject }" val="{ parent.getParameterValue(parameterObject) }" additionalInfo="{ parent.opts.additionalinfo }" onChange="{ parent.handleChange }")

  script.
    import './parameter.tag';
    import script from './index';
    this.external(script);
