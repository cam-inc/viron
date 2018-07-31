viron-modal.Modal(class="{ 'Modal--visible': isVisible, 'Modal--wide': opts.modalopts.isWide, 'Modal--hidden': isHidden } Modal--{ opts.modalopts.theme } Modal--{ layoutType } { opts.modalopts.isSpread ? 'Modal--spread': '' } { opts.modalopts.class }" onTap="{ handleTap }")
  .Modal__frame(style="{ (isDesktop && !!opts.modalopts.width) ? 'width:' +opts.modalopts.width + 'px' : '' }" onTap="{ handleFrameTap }")
    .Modal__closeButton(onTap="{ handleCloseButtonTap }")
      viron-icon-close
    .Modal__content(ref="content")

  script.
    import '../../components/icons/viron-icon-close/index.tag';
    import script from './index';
    this.external(script);
