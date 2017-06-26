dmc-table-cell-action.Table__action
  dmc-button(label="{ opts.action.value }" onPat="{ handleButtonPat }" onHoverToggle="{ handleButtonHoverToggle }" )
  dmc-tooltip(if="{ isTooltipOpened }" message="{ tooltipMessage }")

  script.
    import '../../atoms/dmc-button/index.tag';
    import '../../atoms/dmc-tooltip/index.tag';
    import script from './cell-action';
    this.external(script);
