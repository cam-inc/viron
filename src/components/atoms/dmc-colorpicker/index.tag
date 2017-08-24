dmc-colorpicker.Colorpicker
  .Colorpicker__label(if="{ !!opts.label }") { opts.label }
  form.Colorpicker__form(onSubmit="{ handleFormSubmit }")
    input.Colorpicker__dummyInput(onTap="handleInputTap" ref="touch" placeholder="{ opts.placeholder || '' }" readonly="readonly" value="{ color.value }")
    .Colorpicker__container(if="{ opts.isshown }")
      .Colorpicker__picker
        canvas.Colorpicker__canvas
        .Colorpicker__sliderOperation
          .Colorpicker__circleContainer
            .Colorpicker__circle(style="background-color: { generateColorStyle() }")
          .Colorpicker__hueSlider
          .Colorpicker__opacitySlider
        .Colorpicker__colorcodeOperation
          .Colorpicker__inputContainer
            virtual(if="{ color.format === 'HEX' }")
              input.Colorpicker__inputHex(onInput="{ handleInputHexInput }" ref="inputHex" value="{ color.value }")
            virtual(if="{ color.format === 'RGBA' }")
              dmc-numberinput(number="{ color.value.split(',')[0] }" max="255" min="0" onChange="{ handleInputRgbaRedInput }")
              dmc-numberinput(number="{ color.value.split(',')[1] }" max="255" min="0" onChange="{ handleInputRgbaGreenInput }")
              dmc-numberinput(number="{ color.value.split(',')[2] }" max="255" min="0" onChange="{ handleInputRgbaBlueInput }")
              dmc-numberinput(number="{ generateAlphaValue() }" max="100" min="0" onChange="{ handleInputAlphaInput }")
          .Colorpicker__colorcodeContainer
            virtual(if="{ color.format === 'HEX' }")
              .Colorpicker__colorcodeHex {color.format}
            virtual(if="{ color.format === 'RGBA' }" each="{ char in color.format.split('') }")
              .Colorpicker__colorcodeRgba {char}
          .Colorpicker__colorChangeContainer
            .Colorpicker__colorChangeButton(class="{ Colorpicker__colorChangeButton--hover: isColorChangeButtonActive }" mouseDown="{ handleColorChangeButtonTap }" ref="touch" touchStart="{ handleColorChangeButtonTouchStart }" touchEnd="{ handleColorChangeButtonTouchEnd }" mouseOver="{ handleColorChangeButtonMouseOver }" mouseOut="{ handleColorChangeButtonMouseOut }")
              dmc-icon(type="caretUp")
              dmc-icon(type="caretDown")
      
  script.
    import '../dmc-icon/index.tag';
    import '../dmc-numberinput/index.tag';
    import script from './index';
    this.external(script);