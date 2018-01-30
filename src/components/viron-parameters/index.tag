viron-parameters.Parameters(class="{ 'Parameters--narrow': isNarrow }")
  viron-parameters-parameter(each="{ parameterObject in opts.parameterobjects }" val="{ parent.opts.val[parameterObject.name] }" theme="{ parent.opts.theme }" isPreview="{ parent.opts.ispreview }" parameterObject="{ parameterObject }" primary="{ parent.opts.primary }" onChange="{ parent.handleValChange }" onValidate="{ parent.handleValValidate }")

  script.
    import './parameter/index.tag';
    import script from './index';
    this.external(script);
