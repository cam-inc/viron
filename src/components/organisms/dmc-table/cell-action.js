export default function() {
  this.isTooltipOpened = false;
  this.tooltipMessage = this.opts.action.tooltip;

  this.handleButtonPat = () => {
    this.opts.action.onClick(this.opts.action.id, this.opts.action.rowData);
  };

  this.handleButtonHoverToggle = isHovered => {
    if (!this.tooltipMessage) {
      return;
    }
    this.isTooltipOpened = isHovered;
    this.update();
  };
}
