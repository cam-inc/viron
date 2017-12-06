viron-popover.Popover(class="{ isVisible ? 'Popover--visible' : '' } Popover--{ opts.popoveropts.direction }" style="{ getPosition() }")
  .Popover__frameOuter
    .Popover__frameInner(style="{ getSize() }" onTap="{ handleFrameInnerTap }" onScroll="{ handleFrameInnerScroll }")
      .Popover__content(ref="content")
  .Popover__arrow

  script.
    import script from './index';
    this.external(script);
