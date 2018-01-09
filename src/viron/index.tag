viron.Application(class="Application--{ usingBrowser } Application--{ layoutType } Application--{ theme } { isAsideClosed ? 'Application--asideClosed' : '' }")
  .Application__container
    .Application__aside(if="{ isDesktop }")
      .Application__asideAdjuster
        .Application__asideContent
          viron-application-poster(if="{ isTopPage }")
          viron-application-menu(if="{ !isTopPage }")
    .Application__header
      viron-application-header
    .Application__main(ref="main")
      .Application__page
        div(data-is="viron-{ pageName }-page" route="{ pageRoute }")
  viron-application-drawers
  viron-application-mediapreviews
  viron-application-modals
  viron-application-popovers
  viron-application-toasts
  viron-application-progress-linear(isActive="{ isNavigating || isNetworking }")
  viron-application-dimmer(if="{ isNavigating }")
  viron-application-blocker(if="{ isNavigating }")
  viron-application-splash(if="{ !isLaunched }")

  script.
    import '../pages/viron-components/index.tag';
    import '../pages/viron-endpoints/index.tag';
    import '../pages/viron-notfound/index.tag';
    import './blocker/index.tag';
    import './dimmer/index.tag';
    import './drawers/index.tag';
    import './header/index.tag';
    import './mediapreviews/index.tag';
    import './menu/index.tag';
    import './modals/index.tag';
    import './popovers/index.tag';
    import './poster/index.tag';
    import './progress-linear/index.tag';
    import './splash/index.tag';
    import './toasts/index.tag';
    import script from './index';
    this.external(script);
