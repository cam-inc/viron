viron.Application(class="Application--{ usingBrowser }")
  .Application__container
    .Application__aside
      viron-application-poster(if="{ isTopPage }")
      viron-application-menu(if="{ !isTopPage }")
    .Application__header
      viron-application-header
    .Application__main
      .Application__pageInfo TODO
      .Application__page
        div(data-is="viron-{ pageName }" route="{ pageRoute }")
  viron-application-drawers
  viron-application-modals
  viron-application-popovers
  viron-application-toasts
  viron-progress-linear(isActive="{ isNavigating || isNetworking }")
  viron-progress-circular(if="{ isNetworking }")
  viron-application-blocker(if="{ isNavigating }")
  viron-application-splash(if="{ !isLaunched }")

  script.
    import '../components/pages/viron-components/index.tag';
    import '../components/pages/viron-endpoints/index.tag';
    import '../components/pages/viron-notfound/index.tag';
    import '../components/organisms/viron-progress-circular/index.tag';
    import '../components/organisms/viron-progress-linear/index.tag';
    import './blocker/index.tag';
    import './drawers/index.tag';
    import './header/index.tag';
    import './menu/index.tag';
    import './modals/index.tag';
    import './popovers/index.tag';
    import './poster/index.tag';
    import './splash/index.tag';
    import './toasts/index.tag';
    import script from './index';
    this.external(script);
