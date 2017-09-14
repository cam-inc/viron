viron-tooltip(class="Tooltip Tooltip--{ opts.placement || 'topCenter' }")
  .Tooltip__basePoint
    .Tooltip__text { opts.label }

  script.
    import script from './index';
    this.external(script);
