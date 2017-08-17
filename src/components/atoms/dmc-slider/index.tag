dmc-slider.Slider(class="{ Slider--active: isActive, Slider--hover: isHover, Slider--disable: opts.disabled || false }")
  .Slider__label(if="{ !!opts.label }") { opts.label }
  .Slider__container(ref="container" touchStart="{ handleContainerTouchStart }" touchMove="{ handleContainerTouchMove }" touchEnd="{ handleContainerTouchEnd }" mouseDown="{ handleContainerMouseDown }" mouseOver="{ handleContainerMouseOver }" mouseOut="{ handleContainerMouseOut }")
    .Slider__rail
    .Slider__track(style="width: { displayRatio() }%;")
    .Slider__knob(style="left: { displayRatio() }%;")
      .Slider__knobInner
      dmc-tooltip(if="{ isTooltipShown }" label="{ opts.number }")
    .Slider__catcher(mouseMove="{ handleContainerMouseMove }" mouseUp="{ handleContainerMouseUp }")

  script.
    import '../../atoms/dmc-tooltip/index.tag';
    import script from './index';
    this.external(script);
