dmc.Application
  .Application__contents
    .Application__asideColumn
      virtual(if="{ isTopPage }")
        .Application__menu
          .Application__title
            | Design based
            br
            | Management
            br
            | Console
      virtual(if="{ !isTopPage }")
        dmc-menu
    .Application__mainColumn
      .Application__page
        div(data-is="dmc-{ pageName }" route="{ pageRoute }")
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
    import '../components/organisms/dmc-menu/index.tag';
    import '../components/organisms/dmc-modals/index.tag';
    import '../components/organisms/dmc-progress/index.tag';
    import '../components/organisms/dmc-splash/index.tag';
    import '../components/organisms/dmc-toasts/index.tag';
    import script from './index';
    this.external(script);
