viron-datepicker-cell.Datepicker__cell(onClick="{ handleClick }" class="{(opts.iscurrentmonth) ? '' : 'Datepicker__cell--secondary'} {(opts.istoday) ? 'Datepicker__cell--today' : ''} {(opts.isselected) ? 'Datepicker__cell--selected' : ''}")
  virtual { opts.date.date() }

  script.
    import script from './cell';
    this.external(script);
