viron-components-page-search.ComponentsPage_Search
  .ComponentsPage_Search__head
  .ComponentsPage_Search__body
    viron-parameters(val="{ val }" parameterObjects="{ opts.parameterObjects }" onChange="{ handleParametersChange }")
  .ComponentsPage_Search__tail

  script.
    import '../../../components/viron-parameters/index.tag';
    import script from './index';
    this.external(script);
