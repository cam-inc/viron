dmc-table-items-button.Table__itemsButton(class="{ opts.class }" ref="touch" onTap="handleTap" onMouseOver="{ handleMouseOver }" onMouseOut="{ handleMouseOut }")
  dmc-icon(type="{ icon }")
  dmc-tooltip(if="{ isTooltipVisible }" label="{ tooltipLabel }")
  .Table__itemsButtonCatcher

  script.
    import '../../atoms/dmc-icon/index.tag';
    import '../../atoms/dmc-tooltip/index.tag';
    import script from './button';
    this.external(script);
