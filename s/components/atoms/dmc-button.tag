dmc-button(class="Button Button--{ opts.type || 'primary' } { opts.class }" onclick="{ handleClick }" onMouseOver="{ handleMouseOver }" onMouseOut="{ handleMouseOut }")
  span { opts.label }

  script.
    handleClick(e) {
      e.stopPropagation();
      this.opts.onclick && this.opts.onclick();
    }

    handleMouseOver() {
      this.opts.onhovertoggle(true);
      if (!!this.tooltipMessage) {
        this.isTooltipOpened = true;
      }
      this.update();
    }

    handleMouseOut() {
      this.opts.onhovertoggle && this.opts.onhovertoggle(false);
    }
