viron-drawer(class="Drawer Drawer--{ opts.theme }" ref="touch" onTap="handleTap")
  .Drawer__frame
    .Drawer__content(ref="content")

  script.
    import script from './partial';
    this.external(script);
