dmc-tooltip(class="Tooltip Tooltip__border--width Tooltip--{ opts.placement }")
  div.Tooltip__text
    div.Tooltip--centerHorizontal {opts.label}

  script.
    import script from './index';
    this.external(script);
