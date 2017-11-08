viron-modal(class="Modal Modal--{ opts.theme  }" onTap="{ handleTap }")
  .Modal__frame(onTap="{ handleFrameTapk }")
    .Modal__closeButton(onTap="{ handleCloseButtonTap }") TODO
    .Modal__content(ref="content")

  script.
    import script from './index';
    this.external(script);
