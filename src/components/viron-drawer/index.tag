viron-drawer.Drawer(class="Drawer--{ opts.theme }" onTap="{ handleTap }")
  .Drawer__frame
    .Drawer__content(ref="content")

  script.
    import script from './index';
    this.external(script);
