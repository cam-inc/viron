dmc-component-action.Component__action
  dmc-button(label="{ label }" onPat="{ handleButtonPat }" onHoverToggle="{ handleButtonHoverToggle }")
  dmc-tooltip(if="{ isTooltipOpened }" message="{ tooltipMessage }")

  script.
    import '../../atoms/dmc-button/index.tag';
    import '../../atoms/dmc-tooltip/index.tag';
    import script from './action';
    this.external(script);
