dmc-tooltip(class="Tooltip Tooltip--{ opts.placement }")
  .Tooltip__container
    .Tooltip__text { opts.label }

  script.
    import script from './index';
    this.external(script);
