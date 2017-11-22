viron-components-page-card.ComponentsPage_Card
  .ComponentsPage_Card__body
    div(data-is="viron-components-page-{ opts.def.style }" id="{ componentId }" def="{ opts.def }")


  script.
    import './graph-bar/index.tag';
    import './graph-horizontal-bar/index.tag';
    import './graph-horizontal-stacked-bar/index.tag';
    import './graph-line/index.tag';
    import './graph-scatterplot/index.tag';
    import './graph-stacked-area/index.tag';
    import './graph-stacked-bar/index.tag';
    import './number/index.tag';
    import './table/index.tag';
    import script from './index';
    this.external(script);
