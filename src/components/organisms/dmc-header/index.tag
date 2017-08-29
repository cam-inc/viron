dmc-header.Header
  .Header__groups
    .Header_group
      .Header__button.Header__menuButton(if="{ isMenuEnabled }" ref="touch" onTap="handleMenuButtonTap")
        dmc-icon(type="{ isMenuOpened ? 'menuUnfold' : 'menuFold' }")
    .Header__group
      .Header__button.Header__homeButton(ref="touch" onTap="handleHomeButtonTap")
        dmc-icon(type="home")

  script.
    import '../../atoms/dmc-icon/index.tag';
    import script from './index';
    this.external(script);
