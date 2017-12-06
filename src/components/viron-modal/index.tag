viron-modal.Modal(class="{ isVisible ? 'Modal--visible' : '' } Modal--{ opts.modalopts.theme } Modal--{ layoutType } { opts.modalopts.isSpread ? 'Modal--spread': '' }" onTap="{ handleTap }")
  .Modal__frame(onTap="{ handleFrameTap }")
    .Modal__content(ref="content")
    viron-icon-close.Modal__closeButton(onTap="{ handleCloseButtonTap }")

  script.
    import '../../components/icons/viron-icon-close/index.tag';
    import script from './index';
    this.external(script);
