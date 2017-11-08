viron-drawer(class="Drawer Drawer--{ opts.theme }" onClick="{ handleClick }")
  .Drawer__frame
    .Drawer__content(ref="content")

  script.
    import script from './partial';
    this.external(script);
