dmc-tooltip.Tooltip
  .Tooltip__wrapper
    .Tooltip__triangle
    .Tooltip__contentWrapper
      .Tooltip__content { opts.message }

  script.
    import script from './index';
    this.external(script);
