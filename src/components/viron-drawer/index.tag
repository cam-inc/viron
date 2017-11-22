viron-drawer.Drawer(class="Drawer--{ opts.theme } { isVisible ? 'Drawer--visible' : '' }  Drawer--{ layoutType }" onTap="{ handleTap }")
  .Drawer__frame(onTap="{ handleFrameTap }")
    .Drawer__content(ref="content")

  script.
    import script from './index';
    this.external(script);
