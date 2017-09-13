viron-modal(class="Modal Modal--{ opts.theme  }" ref="touch" onTap="handleTap")
  .Modal__frame(ref="touch" onTap="handleFrameTap")
    .Modal__closeButton(ref="touch" onTap="handleCloseButtonTap")
      viron-icon(type="close")
    .Modal__content(ref="content")

  script.
    import '../../atoms/viron-icon/index.tag';
    import script from './partial';
    this.external(script);
