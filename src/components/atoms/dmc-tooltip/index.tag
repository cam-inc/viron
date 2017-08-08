dmc-tooltip(class="Tooltip Tooltip--{ opts.placement }")
  span(class="Tooltip__text")
    div(class="Tooltip--centerHorizontal") {opts.placement|| 'Tooltip_text'}

  script.
    import script from './index';
    this.external(script);
