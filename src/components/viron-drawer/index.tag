viron-drawer.Drawer(class="Drawer--{ opts.theme } { 'Drawer--visible' : isVisible, 'Drawer--hidden': isHidden }  Drawer--{ layoutType } { 'Drawer--narrow' : opts.isnarrow} { 'Drawer--wide': opts.iswide }" style="{ opts.depth ? 'z-index:' + opts.depth : '' }" onTap="{ handleTap }")
  .Drawer__frame(onTap="{ handleFrameTap }")
    .Drawer__contentWrapper
      .Drawer__content(ref="content")

  script.
    import script from './index';
    this.external(script);
