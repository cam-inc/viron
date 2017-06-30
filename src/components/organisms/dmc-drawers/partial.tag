dmc-drawer(class="Drawer Drawer--{ opts.theme }" ref="touch" onTap="handleTap")
  .Drawer__closeButton(ref="touch" onTap="handleCloseButtonTap")
    dmc-icon(type="close")
  .Drawer__frame
    .Drawer__content(ref="content")

  script.
    import '../../atoms/dmc-icon/index.tag';
    import script from './partial';
    this.external(script);
