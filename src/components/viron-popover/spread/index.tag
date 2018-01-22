viron-popover-spread.PopoverSpread(class="{ 'PopoverSpread--visible': isVisible, 'PopoverSpread--settled': isSettled }" onTap="{ handleTap }")
  .PopoverSpread__frame(onTap="{ handleFrameTap }")
    .PopoverSpread__content(ref="content")

  script.
    import script from './index';
    this.external(script);
