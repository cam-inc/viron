dmc-timepicker-partial
  .Partialtime__listItem(onTap="handleClick" ref="touch") { opts.time }

    script.
      import script from './partial';
      this.external(script);
