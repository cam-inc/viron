viron-mediapreview.Mediapreview(class="{ 'Mediapreview--visible': isVisible, 'Mediapreview--hidden': isHidden } Mediapreview--{ opts.mediapreviewopts.theme }" onTap="{ handleTap }")
  .Mediapreview__frame(onTap="{ handleFrameTap }")
    .Mediapreview__image(style="background-image: url({ path })")
    .Mediapreview__path { path }
    .Mediapreview__closeButton(onTap="{ handleCloseButtonTap }")
      viron-icon-close

  script.
    import '../../components/icons/viron-icon-close/index.tag';
    import script from './index';
    this.external(script);
