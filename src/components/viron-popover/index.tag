viron-popover.Popover(class="{ 'Popover--visible': isVisible, 'Popover--hidden': isHidden } Popover--{ opts.popoveropts.direction } { 'Popover--error': opts.popoveropts.isError }" style="{ getPosition() }")
  .Popover__blocker
  .Popover__frameOuter
    .Popover__frameInner(style="{ getSize() }" onTap="{ handleFrameInnerTap }" onScroll="{ handleFrameInnerScroll }")
      .Popover__content(ref="content")
  .Popover__arrow

  script.
    import script from './index';
    this.external(script);
