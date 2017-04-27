dmc-button(class="Button {opts.class}" click="{ handleClick }")
  yield.

  script.
    handleClick(e) {
      e.stopPropagation();
      this.opts.click();
    }
