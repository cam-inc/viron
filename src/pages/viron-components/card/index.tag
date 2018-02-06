viron-components-page-card.ComponentsPage_Card(class="ComponentsPage_Card--{ columnSize } ComponentsPage_Card--{ rowSize }")
  div(data-is="viron-components-page-{ cardType }" id="{ componentId }" def="{ opts.def }" crossSearchQueries="{ opts.crosssearchqueries }")


  script.
    import './chart/index.tag';
    import './number/index.tag';
    import './table/index.tag';
    import './unsupported/index.tag';
    import script from './index';
    this.external(script);
