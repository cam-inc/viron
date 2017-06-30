dmc.Application
  .Application__contents
    .Application__mainColumn
      .Application__page
        div(data-is="dmc-{ pageName }" route="{ pageRoute }")
    .Application__asideColumn(class="{ Application__asideColumn--opened : isMenuOpened }")
      dmc-menu
    .Application__head
      dmc-header
  dmc-drawers
  dmc-modals
  dmc-toasts
  dmc-progress(if="{ isNetworking }")
  dmc-blocker(if="{ isNavigating }")
  dmc-splash(if="{ !isLaunched }")

  script.
    import '../components/pages/dmc-components/index.tag';
    import '../components/pages/dmc-endpoints/index.tag';
    import '../components/pages/dmc-notfound/index.tag';
    import '../components/organisms/dmc-blocker/index.tag';
    import '../components/organisms/dmc-drawers/index.tag';
    import '../components/organisms/dmc-header/index.tag';
    import '../components/organisms/dmc-menu/index.tag';
    import '../components/organisms/dmc-modals/index.tag';
    import '../components/organisms/dmc-progress/index.tag';
    import '../components/organisms/dmc-splash/index.tag';
    import '../components/organisms/dmc-toasts/index.tag';
    import script from './index';
    this.external(script);
