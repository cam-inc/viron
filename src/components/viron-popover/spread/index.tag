viron-popover-spread.PopoverSpread(class="{ isVisible ? 'PopoverSpread--visible' : '' }" onTap="{ handleTap }")
  .PopoverSpread__frame(onTap="{ handleFrameTap }")
    .PopoverSpread__content(ref="content")

  script.
    import script from './index';
    this.external(script);
