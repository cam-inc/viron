viron-colorpicker.Colorpicker(class="{ Colorpicker--active: isCatcherActive }")
  .Colorpicker__label(if="{ !!opts.label }") { opts.label }
  form.Colorpicker__form(onSubmit="{ handleFormSubmit }")
    input.Colorpicker__dummyInput(onClick="{ handleInputClick }" placeholder="{ opts.placeholder || '' }" readonly="readonly" value="{ getDummyValue() }")
    .Colorpicker__container(if="{ opts.isshown }")
      .Colorpicker__canvasContainer(ref="canvasContainer" mouseDown="{ handleCanvasMouseDown }" touchStart="{ handleCanvasTouchStart }")
        canvas.Colorpicker__canvas(ref="canvas")
        .Colorpicker__canvasKnob(style="left: { getSpectrumPosition('saturation') }%; top: { getSpectrumPosition('brightness') }%")
          .Colorpicker__canvasKnobInner(style="background-color: { getColorStyle() }")
        .Colorpicker__catcher(mouseMove="{ handleCatcherMouseMove }" mouseUp="{ handleCatcherMouseUp }" touchMove="{ handleCatcherTouchMove }" touchEnd="{ handleCatcherTouchEnd }")
      .Colorpicker__sliderOperation
        .Colorpicker__circleContainer
          .Colorpicker__circle(style="background-color: { getColorStyle() }")
        .Colorpicker__sliderContainer
          .Colorpicker__hueSlider
            viron-slider(number="{ getHsv().h }" min="0" max="359" onChange="{ handleHueSliderChange }")
          .Colorpicker__alphaSlider
            viron-slider(number="{ getAlphaValue() }" min="0" max="100" onChange="{ handleAlphaSliderChange }")
      .Colorpicker__colorcodeOperation
        virtual(if="{ color.format === 'HEX' }")
          .Colorpicker__inputContainer
            input.Colorpicker__inputHex(onInput="{ handleInputHexInput }" ref="inputHex" value="{ getHexValue() }")
            .Colorpicker__colorcodeHex {color.format}
        virtual(if="{ color.format === 'RGBA' }")
          .Colorpicker__inputContainer
            viron-numberinput(number="{ getRgbaValue('red') }" max="255" min="0" onChange="{ handleInputRgbaRedInput }")
            .Colorpicker__colorcodeRgba r
          .Colorpicker__inputContainer
            viron-numberinput(number="{ getRgbaValue('green') }" max="255" min="0" onChange="{ handleInputRgbaGreenInput }")
            .Colorpicker__colorcodeRgba g
          .Colorpicker__inputContainer
            viron-numberinput(number="{ getRgbaValue('blue') }" max="255" min="0" onChange="{ handleInputRgbaBlueInput }")
            .Colorpicker__colorcodeRgba b
          .Colorpicker__inputContainer
            viron-numberinput(number="{ getAlphaValue() }" max="100" min="0" onChange="{ handleInputAlphaInput }")
            .Colorpicker__colorcodeRgba a
        .Colorpicker__colorChangeContainer
          .Colorpicker__colorChangeButton(onClick="{ handleColorChangeButtonClick }")
            viron-icon(type="caretUp")
            viron-icon(type="caretDown")

  script.
    import '../viron-icon/index.tag';
    import '../viron-numberinput/index.tag';
    import '../viron-slider/index.tag';
    import script from './index';
    this.external(script);
