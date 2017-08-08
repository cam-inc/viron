dmc-datepicker-cell.Datapicker__cell(onTap="handleTap" ref="touch" class="{(opts.date.isCurrentMonth) ? '' : 'Datapicker__cell--secondary'} {(opts.date.isToday) ? 'Datapicker__cell--today' : ''} {(opts.date.isSelected) ? 'Datapicker__cell--select' : ''}")
  virtual { date.date() }

  script.
    import script from './cell';
    this.external(script);