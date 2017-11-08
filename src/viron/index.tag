viron.Application(class="Application--{ usingBrowser }")
  .Application__container
    .Application__aside
      viron-application-poster(if="{ isTopPage }")
      viron-application-menu(if="{ !isTopPage }")
    .Application__header
      viron-application-header
    .Application__main
      .Application__page
        div(data-is="viron-{ pageName }" route="{ pageRoute }")
  viron-drawers
  viron-modals
  viron-toasts
  viron-progress-linear(isActive="{ isNavigating || isNetworking }")
  viron-progress-circular(if="{ isNetworking }")
  viron-blocker(if="{ isNavigating }")
  viron-splash(if="{ !isLaunched }")

  script.
    import '../components/pages/viron-components/index.tag';
    import '../components/pages/viron-endpoints/index.tag';
    import '../components/pages/viron-notfound/index.tag';
    import '../components/organisms/viron-blocker/index.tag';
    import '../components/organisms/viron-drawers/index.tag';
    import '../components/organisms/viron-modals/index.tag';
    import '../components/organisms/viron-progress-circular/index.tag';
    import '../components/organisms/viron-progress-linear/index.tag';
    import '../components/organisms/viron-splash/index.tag';
    import '../components/organisms/viron-toasts/index.tag';
    import '../components/atoms/viron-textinput/index.tag';
    import './header.tag';
    import './menu.tag';
    import './poster.tag';
    import script from './index';
    this.external(script);
