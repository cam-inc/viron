dmc-slider
  .Slider__label(if="{ !!opts.label }") { opts.label }
  .Slider__container(onTap="handleContainerTap" ref="touch" touchStart="{ handleContainerTouchEvent }" touchMove="{ handleContainerTouchEvent }" touchEnd="{ handleContainerTouchEvent }" mouseDown="{ handleContainerMouseEvent }" mouseOver="{ handleContainerMouseOver }" mouseOut="{ handleContainerMouseOut }")
    .Slider__rail
    .Slider__track(style="width: { displayRatio() }%;")
    .Slider__knob(style="left: { displayRatio() }%;")
      .Slider__knobInner
      dmc-tooltip(if="{ isTooltipShown }" label="{ opts.number }")
    .Slider__catcher(class="{ Slider__catcher--active: isActive }" mouseMove="{ handleContainerMouseEvent }" mouseUp="{ handleContainerMouseEvent }")

  script.
    import '../../atoms/dmc-tooltip/index.tag';
    import script from './index';
    this.external(script);
