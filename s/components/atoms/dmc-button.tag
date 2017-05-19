dmc-button(class="Button Button--{ opts.type || 'primary' } { opts.class }" onclick="{ handleClick }" onMouseOver="{ handleMouseOver }" onMouseOut="{ handleMouseOut }")
  span { opts.label }

  script.
    handleClick(e) {
      e.preventUpdate = true;
      e.stopPropagation();
      this.opts.onclick && this.opts.onclick();
    }

    handleMouseOver(e) {
      e.preventUpdate = true;
      this.opts.onhovertoggle && this.opts.onhovertoggle(true);
      if (!!this.tooltipMessage) {
        this.isTooltipOpened = true;
        this.update();
      }
    }

    handleMouseOut(e) {
      e.preventUpdate = true;
      this.opts.onhovertoggle && this.opts.onhovertoggle(false);
    }
