dmc-timepicker-partial
  .Timepicker__partialTimeListItem(onTap="handleTap" ref="touch" class="{(opts.isselected) ? 'Timepicker__partialTimeListItem--selected' : ''}") { opts.time }

    script.
      import script from './partial';
      this.external(script);
