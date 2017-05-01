dmc-button(class="Button Button--{opts.type || 'primary'} {opts.class}" click="{ handleClick }")
  yield.

  script.
    handleClick(e) {
      e.stopPropagation();
      this.opts.click();
    }
