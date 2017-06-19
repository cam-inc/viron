dmc-modal(class="Modal Modal--{ opts.theme  }" ref="touch" onTap="handleTap")
  .Modal__frame
    .Modal__closeButton(ref="touch" onTap="handleCloseButtonTap")
      dmc-icon(type="close")
    .Modal__content(ref="content")

  script.
    import '../../atoms/dmc-icon/index.tag';
    import script from './partial';
    this.external(script);
