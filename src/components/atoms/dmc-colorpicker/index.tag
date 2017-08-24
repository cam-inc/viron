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
            virtual(if="{ displayColorcode === 'HEX' }")
              input.Colorpicker__inputSingle(onInput="{ handleInputSingleInput }" ref="inputSingle" value="{ color.value }")
            virtual(if="{ displayColorcode !== 'HEX' }")
              virtual(if="{ displayColorcode !== 'HEX' }" each="{ char in displayColorcode.split('') }")
                input.Colorpicker__inputMultiple
          .Colorpicker__colorcodeContainer
            virtual(if="{ displayColorcode === 'HEX' }")
              .Colorpicker__colorcodeSingle {displayColorcode}
            virtual(if="{ displayColorcode !== 'HEX' }" each="{ char in displayColorcode.split('') }")
              .Colorpicker__colorcodeMultiple {char}
          .Colorpicker__colorChangeContainer
            .Colorpicker__colorChangeButton(class="{ Colorpicker__colorChangeButton--hover: isColorChangeButtonActive }" mouseDown="{ handleColorChangeButtonTap }" ref="touch" touchStart="{ handleColorChangeButtonTouchStart }" touchEnd="{ handleColorChangeButtonTouchEnd }" mouseOver="{ handleColorChangeButtonMouseOver }" mouseOut="{ handleColorChangeButtonMouseOut }")
              dmc-icon(type="caretUp")
              dmc-icon(type="caretDown")
      
  script.
    import '../dmc-icon/index.tag';
    import script from './index';
    this.external(script);