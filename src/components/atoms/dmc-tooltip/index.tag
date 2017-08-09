dmc-tooltip(class="Tooltip Tooltip--{ opts.placement || 'topCenter' }")
  .Tooltip__basePoint
    .Tooltip__text { opts.label || 'Please specify a label' }

  script.
    import script from './index';
    this.external(script);
