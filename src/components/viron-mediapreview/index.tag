viron-mediapreview.Mediapreview(class="{ isVisible ? 'Mediapreview--visible' : '' } Mediapreview--{ opts.modalopts.theme }" onTap="{ handleTap }")
  .Mediapreview__frame(onTap="{ handleFrameTap }")
    .Mediapreview__content(ref="content")
    .Mediapreview__closeButton(onTap="{ handleCloseButtonTap }")
      viron-icon-close

  script.
    import '../../components/icons/viron-icon-close/index.tag';
    import script from './index';
    this.external(script);
