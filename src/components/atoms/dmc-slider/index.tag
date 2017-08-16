dmc-slider
  .Slider__label(if="{ !!opts.label }") { opts.label }
  .Slider__container(touchStart="{ handleContainerTouchEvent }" touchMove="{ handleContainerTouchEvent }" touchEnd="{ handleContainerTouchEvent }" mouseDown="{ handleContainerMouseEvent }" mouseOver="{ handleContainerMouseOver }" mouseOut="{ handleContainerMouseOut }")
    .Slider__rail(class="{ Slider__rail--active : isHover }")
    .Slider__track(style="width: { displayRatio() }%;" class="{ Slider__track--active : isHover }")
    .Slider__knob(style="left: { displayRatio() }%;")
      .Slider__knobInner(class="{ Slider__knobInner--active : isHover }")
      dmc-tooltip(if="{ isTooltipShown }" label="{ opts.number }")
    .Slider__catcher(class="{ Slider__catcher--active: isActive }" mouseMove="{ handleContainerMouseEvent }" mouseUp="{ handleContainerMouseEvent }")

  script.
    import '../../atoms/dmc-tooltip/index.tag';
    import script from './index';
    this.external(script);
