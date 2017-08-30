dmc-timepicker-partial
  .Partialtime__listItem(onTap="handleTap" ref="touch" class="{(opts.isselected) ? 'Partialtime__listItem--selected' : ''}") { opts.time }

    script.
      import script from './partial';
      this.external(script);
