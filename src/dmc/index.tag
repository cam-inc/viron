dmc.Application
  .Application__contents
    .Application__asideColumn(class="{ Application__asideColumn--opened : isMenuOpened }")
      dmc-menu
    .Application__mainColumn
      .Application__head
        dmc-header
      .Application__page
        div(data-is="dmc-{ pageName }" route="{ pageRoute }")
  dmc-drawers
  dmc-modals
  dmc-toasts

  script.
    import '../components/pages/dmc-components/index.tag';
    import '../components/pages/dmc-endpoints/index.tag';
    import '../components/pages/dmc-notfound/index.tag';
    import '../components/organisms/dmc-drawers/index.tag';
    import '../components/organisms/dmc-header/index.tag';
    import '../components/organisms/dmc-menu/index.tag';
    import '../components/organisms/dmc-modals/index.tag';
    import '../components/organisms/dmc-toasts/index.tag';
    import script from './index';
    this.external(script);
