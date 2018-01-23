viron-drawer.Drawer(class="Drawer--{ opts.theme } { 'Drawer--visible' : isVisible, 'Drawer--hidden': isHidden }  Drawer--{ layoutType } { opts.isnarrow ? 'Drawer--narrow' : '' }" onTap="{ handleTap }")
  .Drawer__frame(onTap="{ handleFrameTap }")
    .Drawer__contentWrapper
      .Drawer__content(ref="content")

  script.
    import script from './index';
    this.external(script);
