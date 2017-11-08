viron-modal(class="Modal Modal--{ opts.theme  }" onClick="{ handleClick }")
  .Modal__frame(onClick="{ handleFrameClick }")
    .Modal__closeButton(onClick="{ handleCloseButtonClick }")
      viron-icon(type="close")
    .Modal__content(ref="content")

  script.
    import '../../atoms/viron-icon/index.tag';
    import script from './partial';
    this.external(script);
