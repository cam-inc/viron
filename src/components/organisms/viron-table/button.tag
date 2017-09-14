viron-table-items-button.Table__itemsButton(class="{ opts.class }" ref="touch" onTap="handleTap" onMouseOver="{ handleMouseOver }" onMouseOut="{ handleMouseOut }")
  viron-icon(type="{ icon }")
  viron-tooltip(if="{ isTooltipVisible }" label="{ tooltipLabel }")
  .Table__itemsButtonCatcher

  script.
    import '../../atoms/viron-icon/index.tag';
    import '../../atoms/viron-tooltip/index.tag';
    import script from './button';
    this.external(script);
