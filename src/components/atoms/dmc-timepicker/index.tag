dmc-timepicker.Timepicker
    .Timepicker__label(if="{ !!opts.label }") { opts.label }
    .Timepicker__input(onClick="{ handleInputTime }") { fullTime }
    dmc-timepicker-partial(if="{ isShowTimepicker }" partialtime="{ partialTime }")

    script.
      import '../../atoms/dmc-timepicker/partial.tag';
      import script from './index';
      this.external(script);
