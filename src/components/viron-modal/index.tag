viron-modal.Modal(class="{ 'Modal--visible': isVisible, 'Modal--hidden': isHidden } Modal--{ opts.modalopts.theme } Modal--{ layoutType } { opts.modalopts.isSpread ? 'Modal--spread': '' }" onTap="{ handleTap }")
  .Modal__frame(onTap="{ handleFrameTap }")
    .Modal__closeButton(onTap="{ handleCloseButtonTap }")
      viron-icon-close
    .Modal__content(ref="content")

  script.
    import '../../components/icons/viron-icon-close/index.tag';
    import script from './index';
    this.external(script);
