viron-slider.Slider(class="{ Slider--active: isActive, Slider--hover: isHover, Slider--disable: opts.isdisabled || false }")
  .Slider__label(if="{ !!opts.label }") { opts.label }
  .Slider__container(ref="container" touchStart="{ handleContainerTouchStart }" touchMove="{ handleContainerTouchMove }" touchEnd="{ handleContainerTouchEnd }" mouseDown="{ handleContainerMouseDown }" mouseOver="{ handleContainerMouseOver }" mouseOut="{ handleContainerMouseOut }")
    .Slider__rail
    .Slider__track(style="width: { displayActualValue() }%;")
    .Slider__knob(style="left: { displayActualValue() }%;")
      .Slider__knobInner
      viron-tooltip(if="{ isTooltipShown }" label="{ opts.number }")
    .Slider__catcher(mouseMove="{ handleCatcherMouseMove }" mouseUp="{ handleCatcherMouseUp }")

  script.
    import '../../atoms/viron-tooltip/index.tag';
    import script from './index';
    this.external(script);
