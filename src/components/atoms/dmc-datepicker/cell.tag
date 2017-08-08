dmc-datepicker-cell.Datapicker__cell(onTap="handleTap" ref="touch" class="{(opts.iscurrentmonth) ? '' : 'Datapicker__cell--secondary'} {(opts.istoday) ? 'Datapicker__cell--today' : ''} {(opts.isselected) ? 'Datapicker__cell--select' : ''}")
  virtual { opts.date.date() }

  script.
    import script from './cell';
    this.external(script);