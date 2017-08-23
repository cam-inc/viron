dmc-timepicker.Timepicker
  .Timepicker__label(if="{ !!opts.label }") { opts.label }
  dmc-timepicker-partial

    script.
      import '../../atoms/dmc-timepicker/partial.tag';
      import script from './index';
      this.external(script);
