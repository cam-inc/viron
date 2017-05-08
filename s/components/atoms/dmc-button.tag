dmc-button(class="Button Button--{opts.type || 'primary'} {opts.class}" onclick="{ handleClick }")
  yield.

  script.
    handleClick(e) {
      e.stopPropagation();
      this.opts.onclick && this.opts.onclick();
    }
