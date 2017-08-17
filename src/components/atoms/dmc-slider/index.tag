dmc-slider
  .Slider__label(if="{ !!opts.label }") { opts.label }
  .Slider__container(ref="container" touchStart="{ handleContainerTouchStart }" touchMove="{ handleContainerTouchMove }" touchEnd="{ handleContainerTouchEnd }" mouseDown="{ handleContainerMouseDown }" mouseOver="{ handleContainerMouseOver }" mouseOut="{ handleContainerMouseOut }")
    .Slider__rail(class="{ Slider__rail--active : isHover }")
    .Slider__track(style="width: { displayRatio() }%;" class="{ Slider__track--active : isHover }")
    .Slider__knob(style="left: { displayRatio() }%;")
      .Slider__knobInner(class="{ Slider__knobInner--active : isHover }")
      dmc-tooltip(if="{ isTooltipShown }" label="{ opts.number }")
    .Slider__catcher(class="{ Slider__catcher--active: isActive }" mouseMove="{ handleContainerMouseMove }" mouseUp="{ handleContainerMouseUp }")

  script.
    import '../../atoms/dmc-tooltip/index.tag';
    import script from './index';
    this.external(script);
