dmc-button(class="Button Button--{ opts.type || 'primary' } { opts.class } { opts.isdisabled ? 'Button--disabled' : ''}" onClick="{ handleClick }" onMouseEnter="{ handleMouseEnter }" onMouseLeave="{ handleMouseLeave }")
  span { opts.label }

  script.
    handleClick(e) {
      e.preventUpdate = true;
      e.stopPropagation();
      if (this.opts.isdisabled) {
        return;
      }
      this.opts.onclick && this.opts.onclick();
    }

    handleMouseEnter(e) {
      e.preventUpdate = true;
      this.opts.onhovertoggle && this.opts.onhovertoggle(true);
      if (this.opts.isdisabled) {
        return;
      }
      if (!!this.tooltipMessage) {
        this.isTooltipOpened = true;
        this.update();
      }
    }

    handleMouseLeave(e) {
      e.preventUpdate = true;
      if (this.opts.isdisabled) {
        return;
      }
      this.opts.onhovertoggle && this.opts.onhovertoggle(false);
    }
